# Diagnóstico inicial — Ely Oliveira

12 de novembro de 2026. Escopo: implementação local do briefing e dos textos recebidos. Sem push, deploy ou alteração de DNS.

A pasta fornecida continha somente `public`, com 15 materiais: duas fotografias reais, logos em SVG/PNG, prancha da identidade, logo JP Creative e dois certificados. Não havia código, package.json, lockfile, configuração de analytics, `.git` ou Ficha Individual local. A busca na documentação conectada não localizou uma ficha individual. Não existe arquitetura local a substituir.

O Manual Oficial foi consultado na fonte oficial. O site `https://terapiaely.com.br` redireciona para `https://www.terapiaely.com.br`. A auditoria do HTML e dos bundles públicos confirmou Next.js, GA4 `G-J40CVBFQNY`, Vercel Analytics e a rota `/privacidade`. A nova base preserva o domínio canônico com www e redireciona a rota antiga da política. Não há acesso ao painel Vercel, GA4 ou Search Console; visitas e conversões reais dependem de validação externa após publicação autorizada.

## Implementação prevista

Next.js App Router, React, TypeScript, Tailwind e CSS próprio. Conteúdo estático no servidor, pequenos componentes interativos para navegação, FAQ, animações e preferências. Bootstrap Icons em SVG individual, fontes locais Cormorant Garamond e Montserrat. Sem backend clínico, formulário, agendamento, newsletter ou checkout.

Serão criados `src/app`, `src/components`, `src/content`, `src/lib`, configurações, testes e documentação. Os materiais originais serão preservados. Certificados serão movidos de `public/diplomas` para `.private/diplomas`, que não será servido nem versionado.

## Direção visual

Preto #171717, dourado #C6A15B, branco #FFFFFF e champanhe #D8C9AE, com superfícies derivadas. Cormorant Garamond nos títulos e Montserrat na leitura. Hero assimétrico com a fotografia real, narrativa com retrato lateral, conexões abstratas em SVG no capítulo TRG, atendimento editorial e rodapé orgânico em camadas. Três momentos de movimento mais expressivos: história, TRG e rodapé. Rolagem nativa, sem aprisionamento ou animações contínuas fora da tela.

## Limitações e decisões

- `meadow-rise-footer.tsx` não estava na pasta inicial. João Pedro forneceu o código durante a execução. A implementação passou a preservar seu gerador de camadas, iluminação, textura, buffers e névoa, adaptando cores, interações, acessibilidade e desempenho. A imagem específica do dock continua indisponível; o dock segue a descrição detalhada do briefing.
- Os certificados têm nome completo diferente daquele no briefing. João Pedro confirmou que pertencem à Ely e autorizou a exibição dos dois cursos como aperfeiçoamento. A seção foi aprovada e habilitada, sem exibir os arquivos ou inferir graduação/habilitação.
- Textos fornecidos na mensagem serão implementados integralmente para revisão. A confirmação editorial da Ely e os títulos provisórios continuam como etapas anteriores à publicação.
- Modo de revisão local usa `CONTENT_REVIEW=true`, bloqueia indexação e mostra os rascunhos. Produção usa `false` e só exibe seções aprovadas, inclusive removendo as âncoras correspondentes.
- Política de privacidade será uma minuta correspondente ao funcionamento implementado. A revisão final do responsável é necessária antes da publicação.
- Não modificar configurações do site publicado nem atribuir resultados terapêuticos ou qualificações não comprovadas.

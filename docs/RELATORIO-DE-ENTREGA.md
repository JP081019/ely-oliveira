# Entrega local — Ely Oliveira

12 de novembro de 2026 · JP Creative · Departamento de Programação

**Situação:** implementação local preparada para revisão. Sem push, deploy ou alteração do site publicado.

**[Abrir a prévia completa](http://127.0.0.1:3100)**

## 1. Resumo executivo

Homepage editorial com as fotografias e a marca aprovadas, navegação flutuante, história pessoal completa, apresentação da TRG, atendimento online, qualificações confirmadas, cinco perguntas frequentes e rodapé Meadow Rise adaptado. Contato direto pelo WhatsApp oficial em todos os pontos previstos. Política de privacidade e preferências acessíveis por caminhos próprios.

## 2. Arquitetura

A pasta inicial continha somente os materiais da cliente. Foi criada uma base Next.js 16.4.6, React 19.3.1, TypeScript e Tailwind CSS 4.3.5, com versões fixadas e lockfile. Conteúdo estático é renderizado no servidor; os componentes interativos ficam isolados. As páginas foram pré-renderizadas na compilação de produção.

Foram preservados os materiais originais e os contatos fornecidos. O domínio canônico continua `https://www.terapiaely.com.br`, destino do redirecionamento do site atual. `/privacidade` redireciona permanentemente para `/politica-de-privacidade`.

Os certificados foram movidos integralmente para `.private/diplomas`, fora da área pública e do versionamento. Os endereços antigos e tentativas de acesso à pasta interna retornaram 404 nos testes.

## 3. Componentes

`Hero`, `FloatingNavigation`, `AboutEly`, `StoryContinuation`, `TRGExperience`, `AttendanceSection`, `QualificationsSection`, `FAQSection`, `ElyFooter`, `JPCreativeSignature`, `CookiePreferences`, `AnalyticsGate`, `ContactLink`, `MotionOrchestrator` e `SiteIcon`.

O Meadow Rise está em `src/components/ui/meadow-rise-footer.tsx`; os cálculos originais da cena estão em `meadow-scene.ts`. O alias `@/components/ui` e `components.json` seguem a organização shadcn. Não foi instalado outro conjunto de ícones ou uma biblioteca de animação desnecessária.

## 4. Design

Aplicação de preto #171717, dourado #C6A15B, branco e champanhe #D8C9AE, com superfícies derivadas. Cormorant Garamond e Montserrat são servidas localmente, sem requisição de fontes a terceiros. Bootstrap Icons são reunidos em um SVG com somente os símbolos utilizados.

O Hero usa a fotografia real, máscara editorial e CTA imediato. O dock lateral expande os rótulos sem deslocar os ícones; no celular, há barra inferior com menu de seções. A história tem retrato lateral e expansão do relato integral.

A TRG tem conexões abstratas em SVG e desenho acompanhado pela rolagem nativa. A legenda identifica a ilustração como representação artística. Não há aprisionamento da rolagem nem representação da cena como evidência neurológica.

O rodapé preserva o gerador de camadas, iluminação, textura, buffers e névoa do componente fornecido durante a execução. Usa as cores e logos oficiais da Ely, sem newsletter, pétalas ou flores. A pintura tem orçamento por quadro, resolução reduzida no celular, pausa fora da proximidade da tela e suspensão com a aba oculta. Movimento reduzido apresenta a composição final estática. O crédito JP Creative inclui o arquivo oficial e o domínio confirmado no Manual.

## 5. Conteúdo

Os textos enviados para história, atendimento e FAQ foram implementados integralmente. A história completa aparece ao selecionar “Continue minha história”. Não foram adicionados diagnósticos específicos das filhas, depoimentos, preços, duração de sessões ou promessa de resultado.

João Pedro confirmou que os certificados pertencem à Ely e autorizou a publicação das informações como aperfeiçoamento: Psicologia Clínica e Psicologia Forense, Instituto de Ensino e Mentorias do Brasil, 180 horas cada, concluídos em 21/10/2026 e 24/10/2026. A seção esclarece a natureza dos cursos e mantém “Terapeuta Emocional” como identificação.

Conforme o briefing, os títulos provisórios, a história, a apresentação da TRG, o atendimento e o FAQ permanecem em estado editorial `draft` até a confirmação da Ely. Os cursos estão `approved`. Esses estados são internos e não aparecem na interface.

Na prévia local, `CONTENT_REVIEW=true` permite revisar os rascunhos e impede indexação. Com `false` ou sem essa variável, apenas seções aprovadas e seus links aparecem. Essa proteção foi verificada no HTML de uma compilação de produção: início, qualificações e contato presentes; história, atendimento e FAQ ausentes; nenhuma âncora inválida.

## 6. Analytics

A auditoria do HTML e dos arquivos públicos do site atual identificou GA4 **G-J40CVBFQNY** e Vercel Analytics. A propriedade foi preservada; não foi criada outra conta ou tag paralela.

O Google só carrega após autorização para Análise. Consent Mode v2 básico mantém armazenamento e finalidades de publicidade negados. As visualizações não dependem do envio automático duplicado do Google; navegações internas são acompanhadas pelo componente único. Eventos registram somente o tipo de clique e a posição do botão, sem mensagens, diagnósticos ou dados de visitantes. URLs são limpas de parâmetros e fragmentos.

Vercel Analytics fica desativado na prévia comum e está preparado para ativação no ambiente de hospedagem. Uma compilação local com a integração ativada confirmou ausência de tag antes do aceite, uma única tag após o aceite, limpeza de parâmetros e fragmentos da URL e retorno nulo do filtro de eventos após revogação. Os testes interceptam requisições para evitar enviar visitas de teste aos fornecedores. A validação de recebimento em Tag Assistant, DebugView e dashboards continua externa e deverá ocorrer depois da publicação autorizada.

## 7. SEO

Título, descrição, canonical, Open Graph, favicon e metadados de compartilhamento configurados. A imagem Open Graph é gerada a partir da marca original. Há um único H1 na homepage, hierarquia de títulos e dados estruturados do tipo Person, sem atribuição de categoria médica ou psicológica regulamentada.

`robots.txt` bloqueia a prévia. Em produção, referencia o sitemap do domínio oficial. O sitemap inclui a homepage e passa a incluir a política quando seu texto estiver aprovado. Não inclui endereços de desenvolvimento ou seções inexistentes. A antiga rota de privacidade permanece compatível por redirecionamento 308.

Não houve alteração de DNS ou acesso às configurações do Search Console. Verificação da propriedade, envio do sitemap e status real de indexação permanecem para a publicação.

## 8. Privacidade

Banner com aceitar, rejeitar e personalizar, sem privilegiar visualmente o aceite. As únicas categorias são Necessários e Análise. As preferências podem ser reabertas no rodapé e são armazenadas por até 180 dias, com controle de versão e expiração.

A revogação desativa novos eventos opcionais e remove cookies de análise acessíveis no domínio. Não há formulário, cadastro, newsletter, agendamento ou coleta clínica. A política explica os comportamentos efetivamente implementados e a diferença entre Google e Vercel Analytics.

O texto em `src/content/privacy.ts` é uma minuta. Antes da publicação, confirmar identificação completa do responsável, canal definitivo para privacidade, fundamentos aplicáveis, retenção configurada nas contas e processamento pelos fornecedores; encaminhar à revisão apropriada.

## 9. Performance e verificações técnicas

Fotos com `next/image`, AVIF/WebP, tamanhos responsivos, dimensões estáveis e prioridade para a imagem principal. Não foi adicionado GSAP, Motion ou canvas à experiência TRG. O canvas está restrito ao rodapé e preserva uma alternativa visual estática.

Resultados verificados:

| Verificação | Resultado |
| --- | --- |
| Lint | Aprovado, sem avisos |
| TypeScript | Aprovado |
| Testes unitários de consentimento | 2 aprovados |
| Navegador: conteúdo, links, privacidade e responsividade | 4 cenários aprovados |
| Toque Android/Chrome e iPhone/WebKit, reflow a 200% e Vercel ativado | 4 cenários adicionais aprovados |
| Compilação de produção | Aprovada; páginas estáticas geradas |
| Erros de configuração, compilação e execução do Next.js | Nenhum nas verificações finais |
| Auditoria npm | 0 vulnerabilidades após correção delimitada de dependência de desenvolvimento |

Uma amostra local em desenvolvimento registrou LCP de 464 ms, FCP de 464 ms, TTFB de 163,8 ms e CLS 0. Esses valores usam o computador local e recursos aquecidos, sem simulação de rede móvel; não constituem garantia de Core Web Vitals em produção. INP não foi estimado sem uma amostra adequada. Medir novamente no domínio publicado e acompanhar dados de usuários reais.

## 10. Acessibilidade e responsividade

Verificados 320, 360, 390, 430, 768, 1024, 1280, 1440 e 1920 px, sem rolagem horizontal acidental. Testados foco visível, teclado, Escape no menu móvel, botões e estados do FAQ, diálogo nativo de preferências, âncoras, movimento reduzido e alternativas textuais das imagens. Os cenários de toque passaram na emulação Pixel 7 com Chrome e iPhone 13 com WebKit. O reflow equivalente a 200% foi verificado com 720 px de área CSS e escala de dispositivo 2, incluindo menu e expansão da história; isso não é um teste físico de zoom no aparelho.

As auditorias automatizadas axe não apontaram violações nas verificações WCAG A/AA selecionadas em desktop e celular. Auditoria automática não equivale a certificação integral; revisão com leitor de tela e aparelhos físicos continua recomendada para a homologação final.

Capturas e resultados locais estão em `.private/review`. A captura específica do rodapé mostra a cena do componente original; capturas de página inteira podem representar a alternativa estática de seções ainda não percorridas, conforme o carregamento sob demanda.

## 11. Pendências para Revisão e Qualidade

1. Aprovar com Ely os textos fornecidos, os títulos provisórios e a apresentação final das qualificações.
2. Revisar a política e completar os dados operacionais indicados na seção 8.
3. Homologar a composição visual e o comportamento em aparelhos físicos; a emulação iPhone/WebKit foi aprovada, mas não substitui essa etapa.
4. Conferir os destinos e a disponibilidade dos perfis externos nas contas da cliente.
5. Confirmar os painéis e as configurações de Vercel, GA4 e Search Console.

Não houve envio a outro departamento ou contato com a cliente por ferramentas de mensagens. Esta entrega documenta o material pronto para encaminhamento à Revisão e Qualidade.

## 12. Publicação manual por João Pedro

Depois das aprovações, registrar somente os estados efetivamente aprovados em `src/content/ely.ts` e `src/content/privacy.ts`. Configurar `CONTENT_REVIEW=false` no ambiente de produção, preservar o GA4 existente e ativar Vercel Analytics uma única vez.

Executar lint, tipos, testes e build; conferir que `.private`, `.env.local`, relatórios locais e documentos originais não estão no conjunto a enviar. Usar o repositório e projeto Vercel corretos, preservando domínio, propriedade de analytics e demais configurações de produção. Fazer push e deploy somente após a aprovação aplicável.

Após publicar, verificar CTAs, política, preferências, visualizações e revogação de consentimento, além do sitemap e do Search Console. Nenhuma dessas ações externas foi executada nesta implementação local.

## Referências de implementação

- [Manual Oficial da JP Creative](https://docs.google.com/document/d/1-wIR-RKBeQFklpQRI3fZe0Medv8U-37U9i56kFMoGYI/edit).
- Briefing Mestre, Prompt Mestre e textos fornecidos nesta conversa.
- [Next.js — instalação e documentação atual](https://nextjs.org/docs/app/getting-started/installation), além dos guias incluídos na versão instalada.
- [Google — implementação do modo de consentimento](https://developers.google.com/tag-platform/security/guides/consent?hl=pt-br).
- [Vercel — privacidade do Web Analytics](https://vercel.com/docs/analytics/privacy-policy).
- [Bootstrap Icons](https://icons.getbootstrap.com/).

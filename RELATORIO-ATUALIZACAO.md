# Atualização local — Ely Oliveira

Concluída em 03/11/2026. Nenhum commit, push, deploy, acesso a contas ou alteração remota foi realizado.

## Alterações

- Campanha Outubro Rosa retirada por completo do código público, incluindo oferta de R$ 600, componentes, configuração e estilos exclusivos. Preços regulares preservados.
- Identidade, fotos, fontes, animações existentes e crédito com link para JP Creative preservados. Corrigidas as dimensões declaradas da foto final para evitar distorção.
- Seção “Formação e certificações” com TRG em destaque e dois cartões complementares. Documentos completos, modal com Escape, botão de fechar, foco contido e restaurado, bloqueio de rolagem e acesso aos originais.

## Documentos incluídos

| Certificado | Instituição | Horas | Emissão |
| --- | --- | --- | --- |
| Certificação Internacional em TRG | IBFT e IETRG | 360 | 09/10/2026 |
| Aperfeiçoamento em Psicologia Clínica | Instituto de Ensino e Mentorias do Brasil | 180 | 21/10/2026 |
| Aperfeiçoamento em Psicologia Forense | Instituto de Ensino e Mentorias do Brasil | 180 | 24/10/2026 |

Os três arquivos reais estão disponíveis; nenhum documento está faltando. O TRG informa validade provisória de 12 meses. Os outros não apresentam validade informada. Não foram identificados CPF, endereço ou documento pessoal nas imagens. Os cursos complementares não foram apresentados como graduação ou registro CRP.

## Analytics e privacidade

- **Vercel:** integração oficial `@vercel/analytics/next` instalada uma vez, com endereços limitados às páginas públicas, sem busca ou fragmentos. Precisa de ativação manual no painel. A [documentação da Vercel](https://vercel.com/docs/analytics/privacy-policy) descreve seu funcionamento sem cookies; a preferência do banner controla o Google separadamente.
- **GA4:** `G-J40CVBFQNY`, centralizado em variável pública com valor padrão. Integração pelo Google tag oficial via Next Script. Nenhum script Google carregado antes da aceitação ou após recusa persistida. Preferências revisáveis no rodapé e na política. Retirada do consentimento desativa a medição, remove cookies GA acessíveis e recarrega a página.
- **Conversão:** `whatsapp_click`, apenas com `location` e `cta_type`. Links preservados; nenhum telefone, mensagem ou tema de saúde incluído nesses parâmetros.
- **Pageviews:** enviados manualmente, com controle de duplicação, endereço sanitizado e referência vazia. Publicidade e sinais de personalização desativados.
- Política disponível em `/privacidade`, com os pontos de responsabilidade, canal de contato e retenção que ainda precisam de confirmação.

## SEO

Título e descrição revisados, canonical absoluto por página, metadataBase, idioma pt-BR, Open Graph, Twitter com imagem ampla, favicon existente e JSON-LD Person/WebSite sem avaliações ou credenciais inventadas.

Imagem social de 1200 × 630 com a fotografia original, conferida visualmente. Sitemap e robots implementados.

## Validações

- `npm run typecheck`: aprovado.
- `npm run build`: aprovado, incluindo política, imagem social, sitemap e robots; sem warnings relevantes de compilação.
- `scripts/verify.cjs`: aprovado — responsividade, imagens, menu, FAQ, teclado, links, fontes, movimento reduzido e erros do navegador.
- `scripts/reveal-check.cjs`: aprovado — animações, movimento reduzido e conteúdo visível sem JavaScript ou com observador indisponível/inoperante.
- `scripts/update-check.cjs`: aprovado — três certificados, proporções, modal, foco, consentimento, inicialização única, eventos, metadados e rotas SEO.
- Larguras verificadas: 320, 375, 390, 768, 1024 e 1440 px; verificação geral também em 1920 px. Sem rolagem horizontal.
- `git diff --check`: aprovado.

Os testes simularam o script Google para inspecionar comandos sem enviar acessos de teste. O endpoint de estatísticas da Vercel também foi simulado, pois só é disponibilizado pela hospedagem. Coleta real, painel de Analytics e comportamento das medições automáticas ainda dependem da validação em produção.

## Antes da publicação manual

1. **Segurança:** `npm audit` apontou alertas críticos na dependência Next.js 16.3.8 já existente. Revisar sua atualização para versão corrigida e repetir as validações antes de publicar. Não foi feita atualização ampla do framework.
2. Na Vercel, cadastrar `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-J40CVBFQNY` conforme `.env.example` e habilitar Web Analytics no projeto. Nenhuma configuração existente de ambiente foi sobrescrita.
3. **No fluxo de dados web do GA4, desativar a Medição otimizada antes da publicação**, especialmente cliques externos, formulários e alterações de histórico. Isso evita coleta automática de URLs de WhatsApp e pageviews adicionais. Os eventos necessários já são enviados pelo site.
4. Revisar a política com a responsável, confirmando identificação formal do controlador, canal para privacidade e prazos de retenção.
5. Para contar contatos como evento principal, em Eventos do GA4 localizar `whatsapp_click` após seu recebimento e marcá-lo como evento principal. Validar o resultado no painel; um clique representa abertura de contato, não atendimento confirmado.
6. Após publicação, conferir consentimento, compartilhamento e coleta real. No Google Search Console, verificar a propriedade do domínio e enviar [sitemap.xml](https://www.terapiaely.com.br/sitemap.xml). Usar Inspeção de URL para solicitar indexação da página inicial.

## Arquivos alterados ou criados

- `.gitignore`, `.env.example`, `package.json`, `package-lock.json`.
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/opengraph-image.tsx`, `app/privacidade/page.tsx`, `app/robots.ts`, `app/sitemap.ts`.
- `components/certification.tsx`, `components/interactive.tsx`, `components/site-analytics.tsx`, `lib/analytics.ts`.
- `scripts/verify.cjs`, `scripts/reveal-check.cjs`, `scripts/update-check.cjs`.
- Removidos: `components/october-rose.tsx`, `lib/campaigns.ts` e testes antigos `campaign-check.cjs`, `campaign-toggle-check.cjs`, `certification-check.cjs`, substituídos pela cobertura atual.
- `RELATORIO-ATUALIZACAO.md`: este relatório.

As alterações locais de imagens e logo que já existiam ao iniciar foram preservadas. Os dois novos certificados já estavam em `public/images/certificado-2.jpeg` e `public/images/certificado-3.jpeg`.

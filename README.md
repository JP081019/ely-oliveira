# Ely Oliveira — site institucional

Implementação local do redesign, conforme briefing de 12/11/2026. Não houve push, deploy ou alteração do site existente.

## Revisar o site

Prévia local: [abrir o site](http://127.0.0.1:3100). A prévia mostra os textos para revisão e impede indexação.

Para iniciar novamente, abra esta pasta e execute:

```powershell
rtk proxy npm install
rtk proxy npm run dev -- --port 3100
```

Requer Node.js 20.9 ou superior compatível com as dependências; a execução foi validada com Node.js 24. As versões exatas estão no package.json e no package-lock.json.

## Organização

- `src/app`: páginas, estilos, metadados, sitemap e robots.
- `src/components/site`: seções da Ely, navegação, consentimento e medição.
- `src/components/ui`: Meadow Rise adaptado e ícones reutilizáveis.
- `src/content/ely.ts`: história, atendimento, FAQ, qualificações e seus estados de aprovação.
- `src/content/privacy.ts`: minuta da política de privacidade.
- `src/lib/site-config.ts`: marca, links e caminhos dos materiais.
- `.private/diplomas`: certificados originais; fora de public e ignorados pelo Git.
- `.private/review`: capturas e resultados locais de verificação; ignorados pelo Git.
- `docs`: diagnóstico e relatório de entrega.

O alias `@/components/ui` resolve para `src/components/ui`. Esta é a pasta de componentes de interface do projeto, compatível com a organização shadcn. `components.json` aponta para ela e para `src/app/globals.css`. O Meadow Rise fornecido depende de React e dos recursos nativos do navegador, sem necessidade de instalar o conjunto de componentes shadcn ou outra biblioteca de ícones.

## Conteúdo e publicação

Estados internos: `pending`, `draft` e `approved`. Nenhum desses rótulos aparece no site.

- `CONTENT_REVIEW=true`: exibe rascunhos para revisão local e bloqueia a indexação.
- `CONTENT_REVIEW=false` ou ausente: exibe apenas seções aprovadas e seus links.
- Certificados e cursos foram confirmados por João Pedro nesta conversa. Não são apresentados como graduação ou habilitação em Psicologia.
- História, TRG, atendimento, FAQ e títulos provisórios permanecem sujeitos à validação editorial da Ely conforme o briefing.

`.env.local` é exclusivamente local e não deve ser enviado ao repositório. Use `.env.example` para configurar o ambiente de hospedagem, após as aprovações.

## Medição e privacidade

O GA4 existente `G-J40CVBFQNY` foi identificado nos arquivos públicos do site atual. O componente de medição é único e aguarda consentimento para carregar tags. Publicidade permanece negada. Na prévia, Vercel Analytics está desligado; sua integração está preparada para o ambiente de hospedagem.

As preferências duram até 180 dias, podem ser reabertas no rodapé e a rejeição impede novas tags e eventos opcionais. Os testes do GA4 interceptam os pedidos e não enviam medições reais.

## Verificações

```powershell
rtk proxy npm run lint
rtk proxy npm run typecheck
rtk proxy npm test
rtk proxy npm run test:browser
rtk proxy npm run build
```

Os testes de navegador requerem Chrome instalado, WebKit do Playwright (`rtk proxy npx playwright install webkit`) e a prévia na porta 3100. Para verificar outro endereço, configure `TEST_BASE_URL`. Para evitar conflito com o servidor de desenvolvimento, uma compilação paralela pode usar a variável `NEXT_BUILD_DIR=.next-production`.

O cenário opcional de Vercel Analytics usa `TEST_VERCEL=true` e requer uma compilação de produção com `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true`, servida localmente na porta 3101. As requisições de medição são interceptadas. Fora dessa configuração, apenas esse cenário fica marcado como não executado; os demais testes continuam disponíveis.

A correção de `minimatch` no analisador TypeScript é delimitada no campo `overrides`; lint, tipos e auditoria devem ser repetidos ao atualizar essas dependências.

## Entrega

Consulte [o relatório de entrega](docs/RELATORIO-DE-ENTREGA.md) para evidências, limitações, pendências e procedimento de publicação manual.

# Ely Oliveira — Relatório da revisão visual V3.0

16 de novembro de 2026 · JP Creative · Implementação local para revisão de João Pedro

**Situação:** revisão visual implementada e verificada. Nenhum push, deploy ou alteração de domínio foi executado pelo agente.

[Abrir a versão de produção local](http://127.0.0.1:3101) · [Abrir a prévia de desenvolvimento](http://127.0.0.1:3100)

## 1. Diagnóstico inicial

O projeto existente utiliza Next.js, React, TypeScript e Tailwind, com conteúdo estático em `src/content/ely.ts`, seções próprias, navegação flutuante, consentimento de cookies e rodapé Meadow Rise. A implementação foi preservada. O Manual Oficial da JP Creative foi consultado pelo link oficial antes desta revisão.

Na captura inicial, a branch local e a publicação de produção estavam em `main`, commit `c70d4c1423fed8acae2637431ebea8c8727d5650`. A publicação consultada era `dpl_HmWoZqeLvktgEzmsXqeGAc247Ppq`. As sete seções já estavam aprovadas e presentes no HTML público e no build local de referência, antes das alterações visuais.

Portanto, o desaparecimento de seções relatado anteriormente **não foi reproduzido nessa versão de referência**. O mecanismo que explica a diferença histórica entre prévia e produção é a regra editorial: `approved` aparece sempre; `draft` aparece somente quando `CONTENT_REVIEW=true`; `pending` não aparece. A versão antiga descrita no relatório de 12/11 tinha vários rascunhos. A referência atual já contém os sete estados como `approved`. O V3 não alterou esses estados nem a função `canDisplay`.

Localmente, `.env.local` mantém `CONTENT_REVIEW=true`. Essa variável não constava da lista de variáveis de produção consultada na Vercel. Para excluir dependência da prévia editorial, foram compiladas e testadas versões locais com `CONTENT_REVIEW=false`, antes e depois da revisão. As sete seções apareceram em ambas.

Durante os testes foi observado o novo commit `81a4232da98bbd17c4b805af5f6432856bbe1b04`, de autoria de João Pedro, reunindo os arquivos V3. Esse registro ocorreu fora das ações Git do agente. A comparação com a Vercel acima corresponde à captura inicial; não representa uma afirmação sobre publicações feitas posteriormente por outra pessoa.

## 2. Arquivos alterados

| Arquivo | Alteração e finalidade |
| --- | --- |
| `src/app/theme-v3.css` | Novo tema visual: superfícies escuras, títulos, botões, menu branco, legendas abaixo das fotos e cores dos cookies. Carregado após o CSS existente para preservar estrutura e movimento. |
| `src/app/layout.tsx` | Importação do tema V3 e cor da interface do navegador ajustada para `#171717`. |
| `src/components/site/Hero.tsx` | Uso da variante negativa aprovada da marca, tratamento de contorno no título e frases em fluxo abaixo da foto. |
| `src/components/site/AboutEly.tsx` | Separação do contêiner da fotografia e reposicionamento da identificação e frase abaixo dela. Texto da história preservado. |
| `src/components/ui/meadow-rise-footer.tsx` | Paleta escura da paisagem e ligação das cores do fallback às mesmas variáveis. Algoritmos da cena preservados. |
| `src/app/politica-de-privacidade/page.tsx` | Somente variante negativa da marca e dimensões correspondentes. Texto legal preservado. |
| `tests/browser/visual-v3.spec.ts` | Três testes de regressão do V3: estrutura, composição responsiva e acessibilidade automatizada. |
| `tests/browser/conformance.spec.ts` | Duas URLs fixas passam a aceitar `TEST_BASE_URL`, permitindo validar a mesma aplicação em desenvolvimento e produção local. |
| `playwright.config.ts` | Destino do relatório JSON pode ser definido por variável para separar evidências de cada execução. |
| `docs/REVISAO-VISUAL-V3.md` | Este relatório de entrega. |

A remoção de `CONTENT_REVIEW=false` de `.env.example`, também presente no commit `81a4232`, foi observada separadamente e não foi produzida pelos patches V3 do agente. Ela foi preservada. Nenhuma dependência nova foi instalada para esta revisão.

## 3. Ajustes de paleta

O preto `#171717` predomina no Hero, Sobre, TRG, Atendimento, Qualificações, FAQ e Contato. As superfícies `#1F1C18` e `#29251F` e os gradientes discretos mantêm separação entre áreas. Títulos e ações usam dourado `#C6A15B`; o texto usa branco e champanhe `#D8C9AE`.

No rodapé, o céu passou a preto e marrom escuro, com camadas de dourado, bronze e champanhe escurecido. A iluminação foi reduzida após inspeção visual para preservar a leitura do título. O fallback também acompanha a nova paleta. Não permanece uma grande faixa clara no fechamento da página.

## 4. Sistema de títulos

| Tratamento | Aplicação |
| --- | --- |
| A — dourado sólido | Hero, Sobre, Atendimento, Qualificações e chamada final. |
| B — preenchimento escuro com contorno dourado | Segunda parte do título do Hero em telas acima de 800px. Em telas menores ou sem suporte ao contorno, usa dourado sólido para manter legibilidade. |
| C — moldura dourada pontual | Citação editorial da história expandida, com borda fina e superfície escura. |

Os títulos de TRG e FAQ permanecem brancos para variar a hierarquia. Não foram reescritos títulos, textos profissionais ou promessas de atendimento.

## 5. Menu

O dock lateral, seus rótulos expandidos, a barra inferior e o menu de seções receberam fundo branco. Ícones e letras usam `#805E27`, derivação mais escura do dourado para atender ao contraste sobre branco. O estado ativo inclui forma, borda e indicador; no celular, há também sublinhado no rótulo.

Foram preservados os ícones Bootstrap, expansão por hover e foco, identificação da seção ativa, navegação por âncoras, botão de contato e interação por toque. O foco no menu tem contraste próprio sobre branco.

## 6. Imagens

No Hero, “Cada história merece um olhar cuidadoso.” e “Escuta. Presença. Cuidado.” ficam abaixo da imagem, em fluxo normal. No Sobre, nome, identificação profissional e “Uma trajetória de amor, fé e novos caminhos.” ficam abaixo do retrato. Nenhuma dessas frases ocupa cartão lateral ou sobrepõe a fotografia.

As fotografias, textos alternativos e arquivos de marca originais foram mantidos. Hero e página de privacidade usam a variante negativa já aprovada, sem criação de uma nova logo. As legendas conservam as palavras existentes, com tipografia editorial dourada, espaçamento e alinhamento adaptados ao celular.

## 7. Animações

O orquestrador de movimento, as conexões SVG da TRG, o menu, a expansão da história, o FAQ e a assinatura JP Creative não foram substituídos. O tema reaproveita os movimentos existentes e adapta suas superfícies e contrastes.

No Meadow Rise, foram preservados geração determinística, buffers, pintura das camadas, névoa, iluminação, paralaxe, pausas e suporte a movimento reduzido. A revisão se limita à paleta e ao fallback visual. Os testes de toque aguardaram a preparação da cena e confirmaram a marca visível no rodapé.

## 8. Responsividade

Foram verificados os tamanhos de 320, 360, 390, 430, 768, 1024, 1280, 1440 e 1920 pixels. Os testes confirmaram ausência de rolagem horizontal, frases abaixo das respectivas fotos, ausência de colisão entre título e retrato e menu adequado a cada largura.

Também passaram navegação por toque em Pixel 7/Chromium e iPhone 13/WebKit e reflow de 720px com escala 2, equivalente ao espaço disponível com zoom de 200% em um monitor de 1440px. São testes com emulação de dispositivos, não com aparelhos físicos.

As capturas de revisão ficam em `.private/review/v3-desktop.png`, `v3-mobile.png`, `v3-about.png` e `v3-footer.png`. Foram inspecionadas visualmente; esses arquivos locais continuam fora do versionamento.

## 9. Integrações

Código de analytics, regras de consentimento, categorias de cookies, contatos, navegação, domínio canônico, sitemap e robots foram preservados. O tema alterou somente a aparência dos controles de cookies. O único ajuste de metadado visual foi `theme-color`.

Passaram os testes de bloqueio antes do consentimento, aceite, revogação e persistência da rejeição. Com Vercel Analytics habilitado no build local, foi verificada uma única inclusão da tag após o aceite, limpeza de parâmetros privados e bloqueio após revogação. Os serviços externos foram interceptados durante essa verificação; isso valida a integração local, sem afirmar recebimento de eventos nos painéis de produção.

A checagem de HTML confirmou um H1, URL canônica e âncoras existentes. Os testes existentes também verificaram documentos privados indisponíveis publicamente. A assinatura e o link da JP Creative permanecem no rodapé.

**Observação fora do escopo:** a lista de produção consultada tinha `NEXT_PUBLIC_GA_MEASUREMENT_ID`, enquanto a aplicação lê `NEXT_PUBLIC_GA4_MEASUREMENT_ID`. Também não constava `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS`. Isso pode impedir a ativação das integrações esperadas. A prioridade é conferir essas variáveis antes de homologar coleta em produção. Nenhuma variável remota, identificação de analytics ou regra de consentimento foi alterada nesta revisão.

## 10. Build e testes

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | Aprovado, sem erros. |
| `npm run typecheck` | Aprovado. |
| `npm test` | 2 testes aprovados. |
| Build de referência antes da edição, com `CONTENT_REVIEW=false` | Concluído; sete seções no HTML. |
| `npm run build` do V3, com `CONTENT_REVIEW=false` e Vercel Analytics habilitado | Concluído; páginas geradas em `.next-production`. |
| Servidor de produção local na porta 3101 | HTTP 200 e sete seções: `inicio`, `sobre`, `trg`, `atendimento`, `qualificacoes`, `perguntas`, `contato`. |
| Testes específicos V3 contra produção local | 3 aprovados em 10,2s. |
| Pixel 7 e iPhone 13 contra produção local | 2 aprovados em 10,7s. |
| Rodada geral final, prévia na porta 3100 e integração Vercel na 3101 | 11 aprovados em 44,2s, nenhum ignorado ou falho. |
| Axe com regras WCAG 2 A/AA, 2.1 AA e 2.2 AA | Nenhuma violação detectada nos estados testados, incluindo banner e preferências de cookies. |
| Console e execução em produção local | Nenhum erro capturado na navegação da homepage e política de privacidade. |
| CSS das sete seções em produção local | Todas com `visibility: visible`, `opacity: 1` e `display: block` ou `flex`. |
| `git diff --check` | Aprovado. |

Não foram observados erros de hidratação nos percursos verificados. A análise automatizada de acessibilidade complementa a inspeção visual e não constitui certificação integral de conformidade.

Uma rodada intermediária geral encontrou a prévia anterior encerrada (`ERR_CONNECTION_REFUSED`); uma execução anterior também teve timeout no encerramento de um contexto de navegador. A prévia foi reiniciada e a rodada completa passou sem alteração de produto para contornar esses eventos.

Evidências locais: `.private/review/v3-production-results.json`, `v3-mobile-production-results.json` e `v3-final-regression-results.json`. O build testado tem identificador `ZhCHp4SktbuIuvtDnsVfd`.

## 11. Pendências

Não há dependência de novos arquivos para concluir a revisão visual. Ficam para homologação a aprovação manual de João Pedro e da cliente e, se desejado, a conferência em aparelhos físicos.

A diferença de nomes e ativação das variáveis de analytics descrita acima depende de revisão de configuração separada. Não foi tratada como autorização para modificar produção. Os relatórios anteriores permanecem como registros históricos; seus estados editoriais de 12/11 não descrevem a referência atual.

## 12. Publicação

O V3 está preparado para revisão manual. Nenhum comando de push, deploy ou alteração de domínio foi executado pelo agente. A publicação permanece sob responsabilidade de João Pedro, conforme o briefing.

A prévia de produção local usa a porta 3101; o servidor de desenvolvimento usa a porta 3100. Ambos são locais e dependem de os respectivos processos permanecerem ativos.

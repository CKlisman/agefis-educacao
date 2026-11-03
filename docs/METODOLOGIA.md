# AGEFIS + Educação

Painel executivo solicitado para apresentação ao superintendente. Desenvolvido por Caio Klisman. Publicação com link aberto autorizada pelo usuário; somente agregados educacionais estão incluídos.

## Dados

Fotografia em 22/10/2026 do levantamento disponibilizado no Drive. São 54 envios entre 29/09 e 15/10/2026; 51 pessoas após manter a resposta mais recente por e-mail normalizado, com nome como alternativa. Três envios anteriores excluídos. Os dados nominais não integram este projeto.

Vínculos: 42 efetivos, 3 comissionados, 4 terceirizados, 2 estagiários. Estudo do colaborador: 9 sim, 42 não. Estudo do dependente: 34 sim, 12 não, 5 em branco. A existência de dependentes não foi perguntada e não pode ser inferida de uma resposta Não.

Instituições são atuais ou desejadas no mesmo campo do formulário. Nomes equivalentes são consolidados, por exemplo Estácio/Estácio de Sá, UNIFOR/Universidade de Fortaleza, FA7/Uni7, Maria Ester/unidade 2. O termo CHISTUS permanece com a grafia original e o aviso nome a confirmar, distinto de Colégio Christus e Unichristus. Ari de Sá e Farias Brito são agrupados sem inferir o nível de ensino. Cada colaborador conta uma vez por instituição, podendo citar várias. Cursos genéricos e a menção creche municipalizada, sem nome da escola, ficam na nota de qualidade. Não são números de matrículas nem de dependentes.

Conferência de 22/10/2026: lido o Excel original (uma aba, 54 respostas, 11 campos, sem fórmulas); 51 respostas consolidadas e respectivos campos de instituições revisados individualmente. E-mail, nome e telefone confirmam o mesmo conjunto de duplicidades. Os totais de vínculos e respostas Sim/Não coincidem com a primeira versão; foi corrigida a classificação de instituição genérica e retiradas inferências de nome/nível de ensino.

## Uso e manutenção

Filtros por vínculo, estudo do colaborador e estudo do dependente atualizam todos os painéis. O ranking permite respostas Sim ou todas as menções. Há resumo CSV e impressão/PDF. Fonte estática: alterações no Drive requerem uma nova consolidação e publicação.

Design: logo oficial AGEFIS / Prefeitura de Fortaleza fornecida pelo usuário, preservada integralmente em `dist/assets/agefis-logo-pmf.png`. Cinza #343738, laranja #f58220 e verde #087442, com superfícies brancas e tipografia Segoe UI. Prioridade para totais, distribuição, instituições e ressalvas de interpretação. Layout responsivo e gráficos com rótulos textuais. Identidade também presente na impressão/PDF.

Verificar: `node verify.mjs`, `node --check dist/app.mjs`. Prévia local: `node preview.mjs`.

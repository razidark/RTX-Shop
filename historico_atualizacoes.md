# Histórico de Atualizações e Documentação da Arquitetura — RTX Shop
**Data do Relatório**: 16 de Junho de 2026  
**Status**: Concluído e Estabilizado para Produção  

Este documento registra todas as alterações, melhorias de UX, correções de bugs e implementações de novos recursos que realizamos no **RTX Shop** durante este ciclo de desenvolvimento. Serve como referência rápida para entendimento futuro do projeto e manutenção do código.

---

## 🛠️ 1. Painel de Ajustar Produtos (Admin)
### O Problema
O modal de edição de produtos saía do centro da tela ao rolar a página por estar atrelado ao scroll principal e possuía apenas campos básicos de cadastro de produtos.

### Soluções Implementadas
*   **Correção de Layout (Scroll Centralizado)**:
    *   No arquivo [AdminProducts.jsx](file:///g:/RZL%20APPS/RTX%20Shop/src/pages/admin/AdminProducts.jsx), alteramos a propriedade de posicionamento do modal.
    *   O wrapper de fundo (`backdrop`) foi fixado no centro exato da janela visível do usuário (`viewport`) usando `display: 'flex'`, `alignItems: 'center'` e `justifyContent: 'center'`.
    *   Limitamos a altura do painel interno a `maxHeight: '90vh'` com `overflowY: 'auto'`. Agora, a rolagem ocorre apenas dentro do modal, mantendo-o sempre 100% visível na tela.
*   **Novos Campos e Recursos de Loja Profissional**:
    *   **SKU & Código de Barras (EAN)**: Inputs dedicados para o controle de estoque e rastreamento.
    *   **Projeções de Códigos (Live)**: Renders vetoriais em tempo real de **Código de Barras 2D (EAN)** e **Código QR** dinâmico, baseados nas informações inseridas no formulário.
    *   **Preço de Custo & Margem de Lucro**: O sistema calcula automaticamente no painel a margem de lucro (`Margem: X%`) baseada na diferença entre o Preço de Venda e Preço de Custo.
    *   **Peso (g) & Dimensões**: Inputs para peso em gramas e dimensões físicas (comprimento, largura, altura), fundamentais para futuros cálculos de frete.
    *   **Garantia & Status**: Seletor para tempo de garantia e status do catálogo (Ativo, Rascunho, Fora de Linha).
*   **Serialização Sem Alteração de Schema**:
    *   Para evitar novas migrations no banco de dados, os campos extras foram serializados em formato **JSON** e salvos na coluna padrão `description` da tabela `Product` no PostgreSQL.
    *   No arquivo [ProductDetails.jsx](file:///g:/RZL%20APPS/RTX%20Shop/src/pages/ProductDetails.jsx), o frontend detecta se a descrição inicia com `{` e extrai automaticamente a descrição de texto, marca, SKU, EAN, peso, dimensões e termos de garantia para exibi-los na planilha de especificações técnicas do produto.

---

## 🎟️ 2. Sistema de Cupons no Checkout
### Implementações
*   No arquivo [Checkout.jsx](file:///g:/RZL%20APPS/RTX%20Shop/src/pages/Checkout.jsx), adicionamos um campo de cupom de desconto na coluna de resumo do pedido.
*   O cupom padrão **`RTX2026`** foi implementado com validação no frontend. Ao ser inserido, aplica uma redução de **10% de desconto** no subtotal.
*   **Terminologia Solicitada**: Configurado para exibir o termo dinâmico **"Até 10% de desconto"** (PT) ou **"Up to 10% discount"** (EN) na discriminação de preço.
*   O valor com desconto é enviado para a API `/api/orders` garantindo a persistência correta do total faturado no banco de dados.

---

## 🤖 3. Monte seu PC (PC Builder) & Projeção Holográfica 3D
### Implementações
*   No arquivo [PcBuilder.jsx](file:///g:/RZL%20APPS/RTX%20Shop/src/pages/PcBuilder.jsx), criamos botões na parte superior do configurador para carregamento instantâneo de configurações recomendadas (**Presets**):
    *   *Gamer Custo-Benefício (Budget)*
    *   *Pro Streamer & Creator*
    *   *Ultimate Cyberpunk 4K*
*   Clicar em um preset encontra os componentes compatíveis automaticamente em todos os 8 passos do assistente e envia o usuário diretamente à tela de revisão de carrinho.
*   **Projeção Holográfica 3D Avançada (SVG)**:
    *   Desenvolvemos o componente `<HologramPc>` que desenha uma projeção isométrica 3D vetorial pura, responsiva e com efeitos futuristas.
    *   **Ampliação e Detalhamento da Arte**: Expandimos o container para `320px` de altura e redefinimos as coordenadas da projeção isométrica em `viewBox="0 0 300 300"`, dobrando o tamanho visível do computador na tela.
    *   **Estética Realista de Componentes**: Redesenhamos a placa-mãe em perspectiva, o soquete do processador com núcleo dourado pulsante, 4 slots de memória RAM purpurados, gabinete em torre alta com grelhas de ventilação, fonte de alimentação blindada com linhas de circuito elétrico, placa de vídeo (GPU) robusta projetada em 3D com duas ventoinhas circulares e fita de luz RGB arco-íris, e um water cooler com bomba integrada e mangueiras de refrigeração líquida conectadas ao radiador superior.
    *   **Animação de Flutuação Holográfica**: Adicionamos uma animação de levitação por CSS (`float-hologram`) para fazer a projeção do PC oscilar suavemente no ar, reforçando o efeito de holograma.

---

## 🗃️ 4. Gestão e Limpeza de Pedidos (Admin)
### Implementações
*   **Dropdown Customizado Anticlash**:
    *   O seletor nativo do navegador apresentava incompatibilidade cromática (texto branco sobre fundo branco).
    *   Criamos o componente `<StatusDropdown>` em [AdminOrders.jsx](file:///g:/RZL%20APPS/RTX%20Shop/src/pages/admin/AdminOrders.jsx) com estilização escura translúcida (glassmorphism), bordas brilhantes e animação fluida para atualizar o status do pedido de forma legível.
    *   Adicionamos uma regra global de CSS em [index.css](file:///g:/RZL%20APPS/RTX%20Shop/src/index.css) sob `select option` para corrigir todos os seletores nativos restantes na aplicação.
*   **Exclusão e Limpeza de Histórico**:
    *   Criamos a rota backend `DELETE /api/admin/orders` em [routes/admin.js](file:///g:/RZL%20APPS/RTX%20Shop/server/routes/admin.js) que remove simultaneamente pedidos e itens dependentes para evitar erros de chave estrangeira.
    *   Adicionamos um botão **"Limpar Histórico"** para deletar todos os pedidos do banco de dados e botões de **Lixeira Vermelha** para exclusão individual de pedidos.
*   **Exportação de Dados**:
    *   Adicionamos o botão **"Exportar Pedidos (.CSV)"** que gera dinamicamente um arquivo estruturado de dados. 
    *   Adiciona o cabeçalho **UTF-8 BOM** (`\uFEFF`) na string do arquivo para garantir formatação e acentuação correta em português (como `R$`, `Pendente`, `Cancelado`) ao abrir diretamente no Microsoft Excel ou Google Sheets.

---

## 📦 5. Refatoração dos Produtos e Imagens Reais
### O Problema
O site utilizava anteriormente placeholders gerados por inteligência artificial ou imagens locais genéricas (`/images/...`) que não condiziam com a estética de uma loja de alta tecnologia.

### Soluções Implementadas
*   **Substituição de Imagens**: Atualizamos todas as referências no arquivo estático [Catalog.jsx](file:///g:/RZL%20APPS/RTX%20Shop/src/pages/Catalog.jsx) e na configuração do PC Builder para apontar para fotos reais de hardware hospedadas no Wikimedia Commons (livres de IA e direitos autorais restritivos).
*   **Seeder de Dados**: Criamos o arquivo [seed_products.js](file:///g:/RZL%20APPS/RTX%20Shop/server/seed_products.js) no servidor para popular a base PostgreSQL. Ao ser executado (`node server/seed_products.js`), ele limpa as tabelas e adiciona o catálogo de hardware real completo.
*   **Filtros de Catálogo (Suporte a Draft)**: 
    *   Configuramos o catálogo para ignorar e ocultar qualquer produto cadastrado com status `DRAFT` (Rascunho) no campo serializado de descrição.

---

## ⚡ 6. Arquitetura de Execução e Servidores
O RTX Shop funciona como uma aplicação em duas camadas independentes:

1.  **Frontend (Porta 5173)**:
    *   Tecnologia: React + Vite + Vanilla CSS.
    *   Iniciar localmente na raiz do projeto: `pnpm dev`.
    *   *Nota*: Configurado com proxy reverso no `vite.config.js` para encaminhar chamadas de `/api` para a porta 5000 do backend, eliminando erros de CORS em desenvolvimento.
2.  **Backend (Porta 5000)**:
    *   Tecnologia: Node.js + Express + Prisma ORM + PostgreSQL.
    *   Iniciar localmente dentro da pasta `/server`: `pnpm dev` (executa `node --watch server.js`).
    *   Criptografia de Senhas: As senhas dos usuários são salvas como hashes criptográficos via **bcrypt** no banco de dados para segurança de dados (GDPR/LGPD).
    *   *Script de Redefinição*: O arquivo [reset_admin_password.js](file:///g:/RZL%20APPS/RTX%20Shop/server/reset_admin_password.js) pode ser executado a qualquer momento (`node server/reset_admin_password.js`) para restaurar a senha do administrador padrão (`admin@rtxshop.com`) para **`<definida em `server/.env` ou passada por argumentos>`**.

---

## 👥 8. Painel CRM de Clientes (Admin)
### O Problema
A visualização de clientes no painel administrativo estava limitada à exibição de contas com cargo `CUSTOMER`, impedindo a visualização de outros administradores ou funcionários. Além disso, faltava a integração do histórico de compras para cada cliente, faturamento total por usuário e a possibilidade de cadastrar ou alterar cargos de usuários diretamente a partir de um único dashboard centralizado com proteções contra autoexclusão ou autodemissão do administrador ativo.

### Soluções Implementadas
*   **Unificação do CRM de Usuários (Todos os Cargos)**:
    *   No arquivo [admin.js](file:///g:/RZL%20APPS/RTX%20Shop/server/routes/admin.js), removemos o filtro que restringia o endpoint `/api/admin/customers` a usuários com cargo `CUSTOMER`. Agora, a consulta retorna todos os usuários cadastrados com suas respectivas contagens e totais de pedidos.
*   **Métricas e Estatísticas em Tempo Real**:
    *   Adicionamos cards informativos superiores no arquivo [AdminCustomers.jsx](file:///g:/RZL%20APPS/RTX%20Shop/src/pages/admin/AdminCustomers.jsx) mostrando: Total de Usuários, Quantidade de Clientes, Quantidade de Membros da Equipe/Staff e o Volume Faturado total gerado pela base de usuários do CRM.
*   **Filtros Avançados e Ordenação**:
    *   Inserimos seletores dinâmicos para filtragem por Cargo (Todos, Clientes, Funcionários, Administradores) e ordenação por critérios (Mais Recentes, Nome A-Z, Nome Z-A, Mais Compras, Maior Valor Gasto).
*   **Histórico de Compras Integrado (Auditoria)**:
    *   Criamos a rota `/api/admin/customers/:id/orders` no backend para buscar as compras de um cliente específico.
    *   No frontend, adicionamos a opção **"Visualizar Histórico de Compras"** (ícone de sacola de compras). Ela abre um modal responsivo centralizado com barra de rolagem interna que lista os pedidos do cliente, datas, itens detalhados com quantidade e o status estilizado.
*   **Edição e Cadastro de Cargos**:
    *   Tanto no formulário de criação de novo usuário quanto no formulário de edição de perfil, o administrador pode configurar e alterar livremente a permissão (`CUSTOMER`, `EMPLOYEE`, `ADMIN`).
*   **Segurança e Travas de Autoproteção**:
    *   Implementamos travas no backend para que o administrador logado (`req.user.userId`) seja impedido de excluir sua própria conta e de demover seu próprio cargo para uma permissão inferior.

---

## 🧪 9. Teste de Compilação
O projeto foi totalmente testado antes da entrega e compila em produção com zero erros através do comando:
```bash
pnpm run build
```
As saídas geradas na pasta `/dist` contêm os bundles otimizados e minificados para distribuição.

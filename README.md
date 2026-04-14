# 📝 To-Do List Full Stack

Uma aplicação completa de gerenciamento de tarefas com sistema de autenticação, desenvolvida para colocar em prática conceitos de APIs REST, persistência de dados e deploy em nuvem.

## 🚀 Demonstração

- **Front-end:** [https://to-do-api-khaki.vercel.app/]
- **Back-end/API:** [https://to-do-api-0sl9.onrender.com]

## 🛠️ Tecnologias Utilizadas

### Front-end

- HTML5, CSS3 e JavaScript (ES6+)
- **Deploy:** Vercel

### Back-end

- Node.js & Express
- JWT (JSON Web Tokens) para autenticação
- CORS para comunicação entre domínios
- **Hospedagem:** Render

### Banco de Dados

- PostgreSQL (Supabase)
- Conectividade via **Connection Pooling** (Porta 6543)

## ⚙️ Configuração Local

1. Clone o repositório:
   ```bash
   git clone [https://github.com/SeuUsuario/To-Do-API.git](https://github.com/SeuUsuario/To-Do-API.git)
   ```
2. **Instale as dependências:**

```bash
npm install
```

3. Crie um arquivo `.env` na raiz com as seguintes variáveis:

```Snippet de código
DB_USER=seu_usuario
DB_HOST=seu_host_do_supabase
DB_NAME=postgres
DB_PASSWORD=sua_senha
DB_PORT=6543
JWT_SECRET=sua_chave_secreta
```

4. **Inicie o servidor:**

```bash
node app.js
```

## 🧠 Desafios Superados durante o Deploy

Durante o processo de deploy, foram implementadas soluções técnicas para garantir a estabilidade da aplicação em ambiente de produção:

- Conectividade Cloud-to-Cloud: Resolução de erros de rede `(ENETUNREACH)` através da configuração de Connection Pooling do Supabase e ajuste da ordem de resolução de DNS para priorizar IPv4 no ambiente do Render.

- Autenticação e Permissões: Configuração de middlewares de CORS para permitir a comunicação segura entre o domínio da Vercel e a API no Render.

- Ambiente de Produção: Ajuste de variáveis de ambiente e tratamento de erros de certificado SSL `(NODE_TLS_REJECT_UNAUTHORIZED)` para integração com o banco de dados.

- Case Sensitivity no Linux: Padronização de rotas e importações de módulos para garantir compatibilidade com o sistema de arquivos Linux do servidor de hospedagem.

## 📚Documentação da API (Endpoints)

#### Autenticação

`POST /usuarios/cadastro` - Cria um novo usuário.

`POST /usuarios/login` - Autentica o usuário e retorna o token JWT.

#### Tarefas

`GET /tarefas` - Lista todas as tarefas do usuário autenticado.

`POST /tarefas` - Adiciona uma nova tarefa ao banco de dados.

`DELETE /tarefas/:id` - Remove uma tarefa específica pelo ID.

## 🏗️ Arquitetura e Fluxo de Dados

O projeto segue o modelo de arquitetura cliente-servidor:

1. **Client (Vercel):** O front-end em JavaScript consome a API através de requisições assíncronas (Fetch API).
2. **Server (Render):** Uma API RESTful construída com Node.js e Express gerencia as rotas, regras de negócio e autenticação JWT.
3. **Database (Supabase):** Banco de dados relacional PostgreSQL para persistência de usuários e tarefas.

## 🗄️ Modelagem do Banco de Dados

O banco de dados PostgreSQL conta com as seguintes tabelas:

### Tabela `usuarios`

- `id`: UUID (Primary Key)
- `email`: VARCHAR (Unique)
- `senha`: TEXT (Hashed)

### Tabela `tarefas`

- `id`: SERIAL (Primary Key)
- `descricao`: TEXT
- `concluida`: BOOLEAN (Default: false)
- `usuario_id`: UUID (Foreign Key referenciando `usuarios.id`)

## 💡 Lições Aprendidas

Durante o desenvolvimento deste projeto, foquei em resolver problemas reais de infraestrutura, como:

- Configuração de **CORS** para permitir comunicação entre diferentes domínios.
- Gestão de variáveis de ambiente para segurança de credenciais.
- Depuração de logs de servidor para resolver erros de conectividade de rede (IPv6 vs IPv4).
- Implementação de autenticação baseada em **Stateless Tokens (JWT)**.

##### ⚠️ Nota sobre a Hospedagem: Como o back-end utiliza o plano gratuito do Render, o servidor pode entrar em modo de espera após 15 minutos de inatividade. O primeiro carregamento após esse período pode levar cerca de 30 a 50 segundos para que o serviço seja reiniciado automaticamente.

Feito com ❤️ por Lauro Santos

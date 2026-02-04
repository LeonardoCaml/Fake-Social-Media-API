# 🌐 Fake Social Network API

Esta API é um ecossistema completo para simular uma rede social. Ela integra **Node.js**, **Express** e **Prisma** com um banco de dados **MongoDB**, oferecendo um sistema robusto de usuários, postagens e conexões sociais, além de um gerador de dados (Seed) para testes imediatos.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js & Express**: Framework base para a construção da API.
- **MongoDB Atlas**: Banco de dados NoSQL em nuvem.
- **Prisma ORM**: Modelagem de dados e consultas otimizadas.
- **JWT (JSON Web Token)**: Autenticação segura entre cliente e servidor.
- **Bcrypt**: Criptografia (hashing) de senhas para proteção de dados.
- **Morgan**: Log de requisições para monitoramento em tempo real.

---

## 📂 Estrutura do Projeto (MVC)

O projeto está organizado em camadas para facilitar a manutenção:

- `src/routes/`: Definição de rotas públicas e protegidas.
- `src/controllers/`: Lógica de negócio e comunicação com o banco.
- `src/middlewares/`: Filtros de segurança e validação de tokens.
- `lib/`: Configurações globais (instância do Prisma).
- `server.js`: Ponto de entrada da aplicação.

---

## 🛠️ Funcionalidades Detalhadas

### 👥 Gestão de Usuários

- **Listagem Inteligente**: Suporta paginação para evitar sobrecarga e filtro de busca por nome ou username.
- **Perfil Completo**: Consulta de perfil que inclui bio, avatar, contagem de seguidores e os posts mais recentes do usuário.
- **CRUD Completo**: Criação, leitura, atualização e deleção de usuários.

### 📝 Conteúdo e Engajamento

- **Global Feed**: Uma linha do tempo com as postagens de todos os usuários da rede, ordenadas pelas mais recentes.
- **Sistema de Seguidores**: Lógica de relacionamento N:N (muitos para muitos) que permite que usuários sigam uns aos outros sem duplicidade.

---

## 🚀 Instalação e Configuração (For Devs)

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/LeonardoCaml/Fake-Social-Media-API.git](https://github.com/LeonardoCaml/Fake-Social-Media-API.git)
    cd Fake-Social-Media-API
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione:

    ```env
    DATABASE_URL="sua_url_do_mongodb_atlas"
    JWT_SECRET="uma_chave_secreta_longa_e_aleatoria"
    PORT=3000
    ```

4.  **Sincronize o Banco de Dados:**

    ```bash
    npx prisma db push
    ```

5.  **Inicie o Servidor:**
    ```bash
    npm run dev
    ```

---

## 🔐 Autenticação e Segurança

Esta API utiliza **JWT (JSON Web Token)** para proteger rotas sensíveis.

# API Fetch: https://fake-social-media-api.onrender.com

### Como acessar rotas protegidas:

1. **Registro**: Crie sua conta em `POST /register`.
2. **Login**: Autentique-se em `POST /login` para receber seu token de acesso.
3. **Autorização**: Em todas as rotas privadas, envie o token no cabeçalho (Header) da seguinte forma:
   - **Key**: `Authorization`
   - **Value**: `Bearer <seu_token_aqui>`

---

## 🔐 Guia de Autenticação (Passo a Passo)

A API utiliza segurança de ponta. Para interagir com os dados, siga estas etapas:

### 1. Criar uma Conta (`POST /register`)

Envie os dados do novo usuário. A senha será criptografada automaticamente antes de chegar ao banco de dados.

**Request Body:**

```json
{
  "name": "Leonardo Camelo",
  "username": "leonardo_dev",
  "email": "leo@email.com",
  "password": "minha_senha_super_segura",
  "displayName": "Leo Camelo"
}
```

---

### Realizar Login (POST /login)

Após se cadastrar, valide suas credenciais para gerar seu token de acesso.

**Request Body:**

```json
{
  "email": "leo@email.com",
  "password": "minha_senha_super_segura"
}
```

**Resposta do Servidor (Sucesso):**

```json
{
  "message": "Login realizado!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65b2f...",
    "username": "leonardo_dev"
  }
}
```

### 3. Como usar o Token (Bearer Token)

Para acessar rotas como /feed ou /users, você deve incluir o token no cabeçalho de todas as requisições HTTP:

```json
  Header: {
    Authorization: Bearer <TOKEN_AQUI>
  }
```

## Nota: Se você não enviar o token ou ele estiver expirado, a API retornará um erro 401 Unauthorized.

## 🛣️ Endpoints Atualizados

### 🌍 Públicos (Sem Token)

| Método   | Rota        | Descrição                                         |
| :------- | :---------- | :------------------------------------------------ |
| **POST** | `/register` | Cadastra um novo usuário com senha criptografada. |
| **POST** | `/login`    | Valida credenciais e retorna o Token JWT.         |
| **GET**  | `/posts`    | Feed global público (visualização limitada).      |

### 🔒 Privados (Requer Token JWT)

| Método     | Rota               | Descrição                                                 |
| :--------- | :----------------- | :-------------------------------------------------------- |
| **GET**    | `/feed/:userId`    | Retorna o feed personalizado (apenas de quem você segue). |
| **GET**    | `/users`           | Lista usuários (com paginação e busca).                   |
| **GET**    | `/users/:username` | Lista usuários específico (Por username).                 |
| **POST**   | `/follow`          | Segue um usuário (vínculo social).                        |
| **POST**   | `/posts`           | Cria um post.                                             |
| **PUT**    | `/user/:id`        | Atualiza o próprio perfil.                                |
| **DELETE** | `/user/:id`        | Remove a conta e dados vinculados.                        |

---

## 🛠️ Tecnologias de Segurança

- **Bcrypt**: Hashing de senhas com salt (10 rounds).
- **JWT**: Autenticação stateless com expiração de 7 dias.
- **Middleware**: Filtro de segurança centralizado para rotas privadas.

---

## ⚙️ Configuração Técnica

### Variáveis de Ambiente (.env)

```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
PORT=3000
```

---

Desenvolvido por [Leonardo Camelo](https://github.com/LeonardoCaml)

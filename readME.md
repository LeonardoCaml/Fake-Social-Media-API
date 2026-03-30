# 🌐 Fake Social Network API

API completa para simular uma rede social. Construída com **Node.js**, **Express** e **Prisma** sobre um banco **MongoDB**, oferecendo um sistema de usuários, postagens e conexões sociais, além de um gerador de dados (Seed) para testes imediatos.

> **Nota:** Esta API é voltada para testes e uso local — todas as rotas são abertas, sem necessidade de autenticação.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js & Express**: Framework base para a construção da API.
- **MongoDB Atlas**: Banco de dados NoSQL em nuvem.
- **Prisma ORM**: Modelagem de dados e consultas otimizadas.
- **Zod**: Validação de schemas de entrada.
- **Morgan**: Log de requisições para monitoramento em tempo real.
- **Swagger**: Documentação interativa da API.

---

## 📂 Estrutura do Projeto

```
├── server.js              # Ponto de entrada da aplicação
├── routes/
│   └── routes.js          # Definição de todas as rotas
├── controllers/
│   ├── userController.js  # Lógica de usuários (CRUD)
│   └── postController.js  # Lógica de posts e feed
├── middlewares/
│   └── validateMiddleware.js  # Validação de dados com Zod
├── lib/
│   └── prisma.js          # Instância global do Prisma Client
└── prisma/
    ├── schema.prisma      # Modelagem do banco de dados
    └── seed.js            # Gerador de dados fictícios
```

---

## 🛠️ Funcionalidades

### 👥 Gestão de Usuários

- **Listagem Inteligente**: Suporta paginação (`?page=1&limit=10`) e filtro de busca por nome ou username (`?search=leo`).
- **Perfil Completo**: Consulta de perfil que inclui bio, avatar, contagem de seguidores e os posts mais recentes do usuário.
- **CRUD Completo**: Criação, leitura, atualização e deleção de usuários.

### 📝 Conteúdo e Engajamento

- **Feed Global** (`GET /posts`): Linha do tempo com as postagens de todos os usuários, ordenadas pelas mais recentes.
- **Feed Personalizado** (`GET /feed/:userId`): Posts apenas de quem o usuário segue.
- **Criação de Posts**: Até 280 caracteres por publicação.

### 🤝 Sistema de Seguidores

- Relacionamento N:N (muitos para muitos) que permite que usuários sigam uns aos outros sem duplicidade.

---

## 🚀 Instalação e Configuração

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/LeonardoCaml/Fake-Social-Media-API.git
    cd Fake-Social-Media-API
    ```

2. **Instale as dependências:**

    ```bash
    npm install
    ```

3. **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto:

    ```env
    DATABASE_URL="sua_url_do_mongodb_atlas"
    PORT=3000
    ```

4. **Sincronize o Banco de Dados:**

    ```bash
    npx prisma db push
    ```

5. **Popule o banco com dados fictícios (opcional):**

    ```bash
    npx prisma db seed
    ```

6. **Inicie o Servidor:**
    ```bash
    npm run dev
    ```

---

## 🛣️ Endpoints

# API Fetch: https://fake-social-media-api.onrender.com

| Método     | Rota               | Descrição                                                 |
| :--------- | :----------------- | :-------------------------------------------------------- |
| **GET**    | `/users`           | Lista usuários (com paginação e busca).                   |
| **GET**    | `/users/:username` | Retorna o perfil completo de um usuário.                  |
| **POST**   | `/users`           | Cadastra um novo usuário.                                 |
| **PUT**    | `/users/:id`       | Atualiza o perfil de um usuário.                          |
| **DELETE** | `/users/:id`       | Remove a conta e todos os dados vinculados.               |
| **GET**    | `/posts`           | Feed global (todos os posts, ordenados por data).         |
| **POST**   | `/posts`           | Cria um novo post.                                        |
| **GET**    | `/feed/:userId`    | Feed personalizado (apenas de quem o usuário segue).      |
| **POST**   | `/follow`          | Segue um usuário (cria vínculo social).                   |

---

## 📋 Exemplos de Uso

### Criar um Usuário (`POST /users`)

```json
{
  "username": "leonardo_dev",
  "email": "leo@email.com",
  "displayName": "Leo Camelo"
}
```

**Resposta (201):**

```json
{
  "message": "Usuário criado com sucesso!",
  "user": {
    "id": "65b2f...",
    "username": "leonardo_dev",
    "email": "leo@email.com",
    "displayName": "Leo Camelo",
    "createdAt": "2026-03-30T..."
  }
}
```

### Criar um Post (`POST /posts`)

```json
{
  "content": "Meu primeiro post na rede!",
  "authorId": "65b2f..."
}
```

### Seguir um Usuário (`POST /follow`)

```json
{
  "followerId": "65b2f...",
  "followingId": "65b3a..."
}
```

### Listar Usuários com Busca (`GET /users?search=leo&page=1&limit=5`)

Retorna usuários cujo `username` ou `displayName` contenha "leo".

---

## ⚙️ Variáveis de Ambiente (.env)

| Variável       | Descrição                          |
| :------------- | :--------------------------------- |
| `DATABASE_URL` | URL de conexão com o MongoDB Atlas |
| `PORT`         | Porta do servidor (padrão: 3000)   |

---

## 🌱 Seed (Dados Fictícios)

O comando `npx prisma db seed` gera automaticamente:

- **100 Usuários** com nomes, avatares e bios realistas
- **~300 Posts** distribuídos entre os usuários
- **~600 Conexões** de seguidores aleatórias

Ideal para testar paginação, feeds e buscas com volume de dados.

---

Desenvolvido por [Leonardo Camelo](https://github.com/LeonardoCaml)

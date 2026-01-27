# 🌐 Fake Social Network API

Esta API é um ecossistema completo para simular uma rede social. Ela integra **Node.js**, **Express** e **Prisma** com um banco de dados **MongoDB**, oferecendo um sistema robusto de usuários, postagens e conexões sociais, além de um gerador de dados (Seed) para testes imediatos.

## 🛠️ Funcionalidades Detalhadas

### 👥 Gestão de Usuários

- **Listagem Inteligente**: Suporta paginação para evitar sobrecarga e filtro de busca por nome ou username.
- **Perfil Completo**: Consulta de perfil que inclui bio, avatar, contagem de seguidores e os posts mais recentes do usuário.
- **CRUD Completo**: Criação, leitura, atualização e deleção de usuários.

### 📝 Conteúdo e Engajamento

- **Global Feed**: Uma linha do tempo com as postagens de todos os usuários da rede, ordenadas pelas mais recentes.
- **Sistema de Seguidores**: Lógica de relacionamento N:N (muitos para muitos) que permite que usuários sigam uns aos outros sem duplicidade.

---

## 🔐 Autenticação e Segurança

Esta API utiliza **JWT (JSON Web Token)** para proteger rotas sensíveis.

### Como acessar rotas protegidas:

1. **Registro**: Crie sua conta em `POST /register`.
2. **Login**: Autentique-se em `POST /login` para receber seu token de acesso.
3. **Autorização**: Em todas as rotas privadas, envie o token no cabeçalho (Header) da seguinte forma:
   - **Key**: `Authorization`
   - **Value**: `Bearer <seu_token_aqui>`

---

## 🛣️ Endpoints Atualizados

### 🌍 Públicos (Sem Token)

| Método   | Rota        | Descrição                                         |
| :------- | :---------- | :------------------------------------------------ |
| **POST** | `/register` | Cadastra um novo usuário com senha criptografada. |
| **POST** | `/login`    | Valida credenciais e retorna o Token JWT.         |
| **GET**  | `/posts`    | Feed global público (visualização limitada).      |

### 🔒 Privados (Requer Token JWT)

| Método     | Rota            | Descrição                                                 |
| :--------- | :-------------- | :-------------------------------------------------------- |
| **GET**    | `/feed/:userId` | Retorna o feed personalizado (apenas de quem você segue). |
| **GET**    | `/users`        | Lista usuários (com paginação e busca).                   |
| **POST**   | `/follow`       | Segue um usuário (vínculo social).                        |
| **PUT**    | `/user/:id`     | Atualiza o próprio perfil.                                |
| **DELETE** | `/user/:id`     | Remove a conta e dados vinculados.                        |

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

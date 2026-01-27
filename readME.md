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

## 🛣️ Guia de Endpoints

### Usuários

| Método     | Rota               | Parâmetros / Body             | Descrição                                     |
| :--------- | :----------------- | :---------------------------- | :-------------------------------------------- |
| **GET**    | `/users`           | `?page=1&limit=10&search=...` | Lista usuários com paginação e busca.         |
| **GET**    | `/users/:username` | `:username` (na URL)          | Retorna o perfil e os 10 posts mais recentes. |
| **POST**   | `/user`            | `{ email, name, age }`        | Cria um usuário de forma simplificada.        |
| **PUT**    | `/user/:id`        | `{ email, name, age }`        | Atualiza os dados de um usuário pelo ID.      |
| **DELETE** | `/user/:id`        | `:id` (na URL)                | Remove permanentemente um usuário.            |

### Posts

| Método   | Rota     | Parâmetros / Body                 | Descrição                               |
| :------- | :------- | :-------------------------------- | :-------------------------------------- |
| **GET**  | `/posts` | `?page=1&limit=20`                | Retorna o feed global de postagens.     |
| **POST** | `/posts` | `{ content, imageUrl, authorId }` | Cria um novo post vinculado a um autor. |

### Social

| Método   | Rota      | Parâmetros / Body             | Descrição                                   |
| :------- | :-------- | :---------------------------- | :------------------------------------------ |
| **POST** | `/follow` | `{ followerId, followingId }` | Cria um vínculo de seguidor entre dois IDs. |

---

## ⚙️ Configuração Técnica

### Variáveis de Ambiente (.env)

```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
PORT=3000
```

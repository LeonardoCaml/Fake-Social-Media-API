import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fake Social Network API",
      version: "2.0.0",
      description:
        "API para simular uma rede social. Todas as rotas são abertas — sem autenticação.",
    },
    servers: [{ url: "http://localhost:3000" }],
    tags: [
      { name: "Usuários", description: "Gerenciamento de usuários" },
      { name: "Posts", description: "Criação e listagem de posts" },
      { name: "Feed", description: "Feed personalizado por seguidores" },
      { name: "Follows", description: "Conexões entre usuários" },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "664f1b2e3c4a5d6e7f8a9b0c" },
            username: { type: "string", example: "joao_silva" },
            email: { type: "string", example: "joao@email.com" },
            displayName: { type: "string", example: "João Silva" },
            bio: { type: "string", example: "Desenvolvedor apaixonado por código." },
            avatarUrl: { type: "string", example: "https://example.com/avatar.jpg" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: { type: "string" },
            content: { type: "string", example: "Olá, mundo!" },
            imageUrl: { type: "string", nullable: true },
            authorId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            author: {
              type: "object",
              properties: {
                username: { type: "string" },
                displayName: { type: "string" },
              },
            },
          },
        },
        Follow: {
          type: "object",
          properties: {
            id: { type: "string" },
            followerId: { type: "string" },
            followingId: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/routes.js"],
};

export const swaggerSpec = swaggerJsdoc(options);

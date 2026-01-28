import request from "supertest";
// Aqui você importaria seu app Express. Precisamos exportar o 'app' no server.js
import app from "./server.js"; 

describe("Fluxo de Autenticação", () => {
  it("Deve criar um novo usuário com sucesso", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        displayName: "Test"
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message");
  });

  it("Não deve permitir login com senha errada", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "test@example.com",
        password: "senha_errada"
      });
    
    expect(res.statusCode).toEqual(401);
  });
});
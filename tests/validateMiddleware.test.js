import { validate, userSchema, updateUserSchema, postSchema } from "../middlewares/validateMiddleware.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validate middleware", () => {
  describe("userSchema", () => {
    it("chama next() com dados válidos", () => {
      const req = { body: { username: "joao123", email: "joao@email.com" } };
      const res = mockRes();
      const next = jest.fn();

      validate(userSchema)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("retorna 400 com username curto demais", () => {
      const req = { body: { username: "ab", email: "joao@email.com" } };
      const res = mockRes();
      const next = jest.fn();

      validate(userSchema)(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retorna 400 com e-mail inválido", () => {
      const req = { body: { username: "joao123", email: "nao-e-email" } };
      const res = mockRes();
      const next = jest.fn();

      validate(userSchema)(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("updateUserSchema", () => {
    it("chama next() com campos opcionais válidos", () => {
      const req = { body: { bio: "Minha bio", displayName: "Jo Silva" } };
      const res = mockRes();
      const next = jest.fn();

      validate(updateUserSchema)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it("chama next() com body vazio (todos campos opcionais)", () => {
      const req = { body: {} };
      const res = mockRes();
      const next = jest.fn();

      validate(updateUserSchema)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it("retorna 400 com avatarUrl não sendo URL válida", () => {
      const req = { body: { avatarUrl: "nao-e-url" } };
      const res = mockRes();
      const next = jest.fn();

      validate(updateUserSchema)(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("postSchema", () => {
    it("chama next() com dados válidos", () => {
      const req = { body: { content: "Olá, mundo!", authorId: "abc123" } };
      const res = mockRes();
      const next = jest.fn();

      validate(postSchema)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it("retorna 400 com content vazio", () => {
      const req = { body: { content: "", authorId: "abc123" } };
      const res = mockRes();
      const next = jest.fn();

      validate(postSchema)(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});

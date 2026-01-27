import { prisma } from "../../lib/prisma.js";

// Lista usuários com paginação e busca (Otimizado)
export const listUsers = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const skip = (page - 1) * limit;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        createdAt: true,
      },
      skip: Number(skip),
      take: Number(limit),
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

// Retorna o perfil completo de um usuário pelo username
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: { posts: true, following: true, followedBy: true }
        },
        posts: {
          take: 10,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Remove a senha antes de enviar para o cliente
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
};

// Atualiza dados do usuário
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Impedimos a troca de senha por aqui (deve ter uma rota própria por segurança)
    delete data.password;

    const updated = await prisma.user.update({
      where: { id },
      data
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar ou dados inválidos" });
  }
};

// Deleta usuário e limpa relações (Cascade manual para segurança)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({ where: { authorId: id } }),
      prisma.follows.deleteMany({ where: { OR: [{ followerId: id }, { followingId: id }] } }),
      prisma.user.delete({ where: { id } })
    ]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar conta" });
  }
};
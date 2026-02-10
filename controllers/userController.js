import { prisma } from "../lib/prisma.js";

// export const listUsers = async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("ERRO DETALHADO:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

export const listUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" } },
            { displayName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        displayName: true,
      },
      skip: skip,
      take: limit,
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Erro na listagem:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: { posts: true, following: true, followedBy: true },
        },
        posts: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    delete data.password;

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar ou dados inválidos" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({ where: { authorId: id } }),
      prisma.follows.deleteMany({
        where: { OR: [{ followerId: id }, { followingId: id }] },
      }),
      prisma.user.delete({ where: { id } }),
    ]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar conta" });
  }
};

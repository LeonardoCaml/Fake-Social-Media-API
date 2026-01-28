import express from "express";
import cors from "cors"; // Recomendado para APIs públicas
import morgan from "morgan";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import publicRoutes from "./routes/publicRoutes.js";
import privateRoutes from "./routes/privateRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/", publicRoutes);
app.use("/", authMiddleware, privateRoutes);

// // Listar usuários (com paginação e busca)
// app.get("/users", async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search } = req.query;
//     const skip = (Number(page) - 1) * Number(limit);

//     const users = await prisma.user.findMany({
//       where: search
//         ? {
//             OR: [
//               { name: { contains: search, mode: "insensitive" } },
//               { username: { contains: search, mode: "insensitive" } },
//             ],
//           }
//         : {}, // Se não houver busca, passa um objeto vazio em vez de undefined
//       skip: skip,
//       take: Number(limit),
//     });

//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Erro detalhado no Prisma:", error);
//     res
//       .status(500)
//       .json({ error: "Erro ao buscar usuários", details: error.message });
//   }
// });

// // Perfil detalhado de um usuário (com seus posts)
// app.get("/users/:username", async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { username: req.params.username },
//       include: {
//         posts: { orderBy: { createdAt: "desc" }, take: 10 },
//         _count: { select: { followedBy: true, following: true } },
//       },
//     });

//     if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao carregar perfil" });
//   }
// });

// app.get("/feed/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // 1. Encontrar quem o usuário segue
//     const following = await prisma.follows.findMany({
//       where: { followerId: userId },
//       select: { followingId: true },
//     });

//     const followingIds = following.map((f) => f.followingId);

//     // Incluir o próprio ID para ver seus próprios posts no feed
//     followingIds.push(userId);

//     // 2. Buscar posts desses IDs
//     const feed = await prisma.post.findMany({
//       where: {
//         authorId: { in: followingIds },
//       },
//       orderBy: { createdAt: "desc" },
//       include: {
//         author: {
//           select: { username: true, displayName: true, avatarUrl: true },
//         },
//       },
//       take: 20, // Paginação básica
//     });

//     res.json(feed);
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao carregar feed" });
//   }
// });

// // --- ROTAS DE POSTS ---

// // Feed Global (Ver todos os posts da rede)
// app.get("/posts", async (req, res) => {
//   try {
//     const { page = 1, limit = 20 } = req.query;
//     const posts = await prisma.post.findMany({
//       orderBy: { createdAt: "desc" },
//       skip: (page - 1) * limit,
//       take: Number(limit),
//       include: {
//         author: {
//           select: { username: true, displayName: true, avatarUrl: true },
//         },
//       },
//     });
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao carregar feed" });
//   }
// });

// app.post("/user", async (req, res) => {
//   const { email, name, password, username, displayName } = req.body;

//   try {
//     // Transforma "123456" em algo como "$2b$10$X..."
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         username,
//         displayName,
//         password: hashedPassword, // Salva a senha criptografada
//       },
//     });

//     res.status(201).json({ message: "Usuário criado!", id: newUser.id });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: "Erro ao criar usuário ou e-mail já existe" });
//   }
// });

// // Criar um novo post
// app.post("/posts", async (req, res) => {
//   const { content, imageUrl, authorId } = req.body;
//   try {
//     const newPost = await prisma.post.create({
//       data: { content, imageUrl, authorId },
//     });
//     res.status(201).json(newPost);
//   } catch (error) {
//     res.status(400).json({ error: "Erro ao criar post. Verifique os dados." });
//   }
// });

// // --- ROTA DE SEGUIR ---

// app.post("/follow", async (req, res) => {
//   const { followerId, followingId } = req.body;

//   if (followerId === followingId)
//     return res.status(400).json({ error: "Você não pode seguir a si mesmo" });

//   try {
//     const follow = await prisma.follows.create({
//       data: { followerId, followingId },
//     });
//     res.status(201).json(follow);
//   } catch (error) {
//     res.status(400).json({ error: "Já seguindo ou erro na conexão" });
//   }
// });

// // Rota para editar perfil do usuário
// app.put("/user/:id", async (req, res) => {
//   const { id } = req.params;
//   const { email, displayName, username, bio, avatarUrl } = req.body;

//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: {
//         email,
//         displayName,
//         username,
//         bio,
//         avatarUrl,
//       },
//     });

//     console.log(`✅ Usuário ${username} atualizado!`);
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("❌ Erro ao editar usuário:", error);
//     // Se o erro for P2002, significa que o email ou username já existe
//     if (error.code === "P2002") {
//       return res
//         .status(400)
//         .json({ error: "Username ou Email já estão em uso." });
//     }
//     res.status(500).json({ error: "Erro ao editar usuário" });
//   }
// });

// // Rota para deletar usuário e seus dados vinculados
// app.delete("/user/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     // 1. Opcional: Deletar posts do usuário primeiro (Cascade manual)
//     await prisma.post.deleteMany({ where: { authorId: id } });

//     // 2. Deletar as conexões de seguidores
//     await prisma.follows.deleteMany({
//       where: {
//         OR: [{ followerId: id }, { followingId: id }],
//       },
//     });

//     // 3. Deletar o usuário
//     await prisma.user.delete({
//       where: { id },
//     });

//     console.log(`🗑️ Usuário ${id} e seus dados foram removidos.`);
//     res.status(204).send();
//   } catch (error) {
//     console.error("❌ Erro ao deletar usuário:", error);
//     res.status(500).json({ error: "Erro ao deletar usuário" });
//   }
// });

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🚀 API Fake Online: http://localhost:${port}`),
);

export const getFollowersFeed = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId);

    const feed = await prisma.post.findMany({
      where: { authorId: { in: followingIds } },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { username: true, avatarUrl: true, displayName: true },
        },
      },
    });

    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar seu feed." });
  }
};

// Criar um novo Post
export const createPost = async (req, res) => {
  const { content } = req.body;
  const authorId = req.userId;

  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId,
      },
      include: {
        author: { select: { username: true, displayName: true } },
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar post." });
  }
};

// Buscar todos os posts (Feed Global)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { username: true, displayName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts." });
  }
};

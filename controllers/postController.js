export const getFollowersFeed = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });

    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId);

    const feed = await prisma.post.findMany({
      where: { authorId: { in: followingIds } },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { username: true, avatarUrl: true, displayName: true } }
      }
    });

    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar seu feed." });
  }
};
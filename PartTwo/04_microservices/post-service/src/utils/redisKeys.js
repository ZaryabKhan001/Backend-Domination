export const redisKeys = {
  GET_ALL_POSTS: (page, limit) => `posts:${page}:${limit}`,
  GET_POST: (postId) => `post:${postId}`,
};

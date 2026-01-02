export const shouldParseJson = (req) => {
  const contentType = (req.headers['content-type'] || '').toLowerCase();

  return contentType.includes('application/json');
};

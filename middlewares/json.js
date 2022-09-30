export function json({ type = "application/json" } = {}) {
  return async (req, res, next) => {
    if (type === req.headers["content-type"] && req.body == null) {
      const buffers = [];

      for await (const chunk of req) {
        buffers.push(chunk);
      }

      const data = Buffer.concat(buffers).toString();

      req.body = JSON.parse(data);
    }
    next();
  };
}

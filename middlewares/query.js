import { parse as parseUrl } from "url";

export function query({ parseQueryString = true } = {}) {
  return (req, res, next) => {
    if (req.query == null) {
      const url = parseUrl(req.url, parseQueryString);
      req.query = url.query;
    }
    next();
  };
}

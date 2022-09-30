import { createServer, ServerResponse } from "http";
import url from "url";

export { json } from "./middlewares/json.js";
export { query } from "./middlewares/query.js";

export class ExResponse extends ServerResponse {
  text(body) {
    if (this.statusCode == null) this.statusCode = 200;
    this.setHeader("Content-Type", "text/plain");
    this.end(body);
  }
  json(body) {
    if (this.statusCode == null) this.statusCode = 200;
    this.setHeader("Content-Type", "application/json");
    this.end(JSON.stringify(body));
  }

  status(code) {
    this.statusCode = code;
    return this;
  }
}

function selectMethod(method, cb) {
  return (req, res, next) => {
    if (req.method === method) {
      cb(req, res, next);
    } else {
      next();
    }
  };
}

export class Ex {
  #middlewares = [];

  use(route, cb) {
    if (typeof route === "function") {
      cb = route;
      route = "/";
    }
    this.#middlewares.push({ route, cb });
    return this;
  }

  get(route, cb) {
    return this.use(route, selectMethod("GET", cb));
  }

  post(route, cb) {
    return this.use(route, selectMethod("POST", cb));
  }

  listen(...args) {
    const server = createServer((req, res) => {
      let idx = 0;
      const path = url.parse(req.url).pathname ?? "/";
      const next = () => {
        const middleware = this.#middlewares[idx++];
        if (!middleware) {
          // we reached the end
          res.writeHead(404).end();
          return;
        }

        const { route, cb } = middleware;
        if (!path.startsWith(route)) {
          // skip this middleware
          next();
          return;
        }

        // matched
        try {
          Object.setPrototypeOf(res, ExResponse.prototype);
          cb(req, res, next);
        } catch (e) {
          console.error(e);
          res.writeHead(500).end();
        }
      };

      next();
    });

    server.listen(...args);
  }
}

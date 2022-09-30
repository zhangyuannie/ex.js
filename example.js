import { Ex, query, json } from "./ex.js";

const server = new Ex();
server
  .use(query())
  .use(json())
  .get("/hi", (req, res) => {
    res.text(`Your query is ${JSON.stringify(req.query)}`);
  })
  .post("/hi", (req, res) => {
    res.text(`Your body is ${JSON.stringify(req.body)}`);
  })
  .use("/", (req, res) => {
    res.text("Say hi!");
  });

server.listen(8000);

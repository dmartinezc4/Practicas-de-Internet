import { Application, Router } from "oak";

import { removeSlot } from "./resolvers/delete.ts";
import { availableSlots } from "./resolvers/get.ts";
import { addSlot } from "./resolvers/post.ts";
import { bookSlot } from "./resolvers/put.ts";

const router = new Router();

router
  .post("/addUser", addUser)
  .post("/addAuthor", addAuthor)
  .post("/addBook", addBook)
  .delete("/deleteUser/:id", deleteUser)
  .put("/updateCart", updateCart)
  .get("/getBooks", geetBooks)
  .get("/getUser/:id", geetBooks);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
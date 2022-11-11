import { Application, Router } from "oak";

import { deleteUser } from "./resolvers/delete.ts";
import { getBooks,getUser } from "./resolvers/get.ts";
import { addUser,addBook,addAuthor } from "./resolvers/post.ts";
import { updateCart } from "./resolvers/put.ts";

const router = new Router();

router
  .post("/addUser", addUser)
  .post("/addAuthor", addAuthor)
  .post("/addBook", addBook)
  .delete("/deleteUser/:id", deleteUser)
  .put("/updateCart", updateCart)
  .get("/getBooks", getBooks)
  .get("/getUser/:id", getUser);

const app = new Application();

console.log("funciona");

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
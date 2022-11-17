import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { deleteUser } from "./resolvers/delete.ts";
import { getBooks,getUser } from "./resolvers/get.ts";
import { addUser,addBook,addAuthor } from "./resolvers/post.ts";
import { updateCart } from "./resolvers/put.ts";

const router = new Router();

router
  .post("/addUser", addUser)
  .post("/addAuthor", addAuthor)
  .post("/addBook", addBook)
  .delete("/deleteUser", deleteUser)
  .put("/updateCart", updateCart)
  .get("/getBooks", getBooks)
  .get("/getUser/:id", getUser);

const app = new Application();

console.log("funciona");

app.use(router.routes());
app.use(router.allowedMethods());

const PORT=Number(Deno.env.get("PORT"))

await app.listen({ port: PORT });
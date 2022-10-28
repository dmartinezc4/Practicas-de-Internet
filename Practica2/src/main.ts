import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { getUser } from "./resolvers/get.ts";
import { deleteUser } from "./resolvers/delete.ts";
import { addUser, addTransaction } from "./resolvers/post.ts";


const router = new Router();

router
  .get("/getUser/:id", getUser)
  .post("/addUser", addUser)
  .post("/addTransaction", addTransaction)
  .delete("/deleteUser/:id", deleteUser)

const app = new Application();

console.log("funciona");

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 },);
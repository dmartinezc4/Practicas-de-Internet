import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection,booksCollection,authorsCollection } from "../db/mongo.ts";
import { UserSchema,BookSchema,AuthorSchema } from "../db/schemas.ts";

type deleteUserContext = RouterContext<
  "/deleteUser/:id", &
  {
    id:string
  } &
  Record<string | number, string | undefined>,
  Record<string, any>
>;

//Se usará el email para identificar el usuario a borar


export const deleteUser = async(ctx: deleteUserContext) => {
    try{
        if (context.params?.id) {
            const count = await booksCollection.deleteOne({_id: new ObjectId(context.params.id),});
        }
        if (count) {
            context.response.status = 200;
            ctx.response.body = { message: "User deleted succesfully" };
            return;
          } else {
            context.response.status = 404;
            ctx.response.body = { message: "User not found" };
            return;
          }
    }catch(e){        
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }
    
}
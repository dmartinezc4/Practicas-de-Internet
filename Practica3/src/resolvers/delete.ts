import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection,booksCollection,authorsCollection } from "../db/mongo.ts";
import { UserSchema,BookSchema,AuthorSchema } from "../db/schemas.ts";

type deleteUserContext = RouterContext<
  "/deleteUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

//Que me pase el _id del usuario como un json, error si no me pasa el id bien o error si me pone un id que no existe


export const deleteUser = async(ctx: deleteUserContext) => {
    try{
        
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        if(!value._id){
          ctx.response.status = 400;
            ctx.response.body = { message: "Missing mongo id. Remember _id and then the id" };
            return;
        }
        

        const ide= new ObjectId(value._id);

        

        const count = await usersCollection.deleteOne({"_id": ide});
        if (count) {
            ctx.response.status = 200;
            ctx.response.body = { message: "User deleted succesfully" };
            return;
          } else if(!count){
            ctx.response.status = 404;
            ctx.response.body = { message: "User not found" };
            return;
          }else{//Sanity check
            ctx.response.status = 500;
            ctx.response.body = { message: "Unexpected error" };
            return;
          }
    }catch(e){        
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }
    
}
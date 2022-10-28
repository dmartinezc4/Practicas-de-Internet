import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserCollection } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";

type deleteUserContext = RouterContext<
  "/deleteUser/:id", &
  {
    id:string
  } &
  Record<string | number, string | undefined>,
  Record<string, any>
>;

//Se usa el email para definir el usuario a borrar

export const deleteUser = async (ctx: deleteUserContext) => {
    try{
        const email= ctx.params?.id;
        const user=UserCollection.findOne({email})

        if(!user){
            ctx.response.status=404;
            ctx.response.body={message:"User not found"}
            return;
        }
        if(user){
            await UserCollection.deleteOne({email});
            ctx.response.status=200;
            ctx.response.body=user;        
            ctx.response.body={message:"The user has been removed"}
            return;
        }
        ctx.response.body = user;
    }catch(e){
        console.error(e)
        ctx.response.status=500;
    }
    
}


import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserCollection } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";

type GetUserContext = RouterContext<
  "/getUser/:id",
  {
    id:string
  } &
  Record<string | number, string | undefined>,
  Record<string, any>
>;

//En este caso el parámetro único que sea el DNI

export const getUser = async (ctx: GetUserContext) => {

    try{
        if(ctx.params?.id){
            const user:UserSchema |undefined = await UserCollection.findOne({_id: new ObjectId(ctx.params.id),});
        

        if(user){
            ctx.response.status=200;
            ctx.response.body=user;
            return;
        }
    }
        ctx.response.status=404;
    }catch(e){
        console.error(e)
        ctx.response.status=500;
    }
}

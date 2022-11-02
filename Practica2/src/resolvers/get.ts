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

//En este caso el parámetro único que sea el DNI y me va a devolver por el body el usuario que me ha pedido

export const getUser = async (ctx: GetUserContext) => {
    try{
        if(ctx.params?.id){
            const DNIE=ctx.params.id;
            const user:UserSchema |undefined = await UserCollection.findOne({DNI:DNIE});

            if(user){
                //Si está le devolvemos el user y un status ok
                ctx.response.status=200;
                ctx.response.body=user;
                return;

            }else if(user===undefined){
                //Si no lo hemos encontrado con los datos suministrados le indicamos 404 y que no está
                ctx.response.status=404;
                ctx.response.body={message:"User not found with input data"};
                return;

            }else{
                ctx.response.status=500;
                ctx.response.body={message:"Unexpected error"};
                return;

            }
        }
    }catch(e){//Try catch para internal server error
        console.error(e);
        ctx.response.status=500;
    }
}
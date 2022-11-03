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

//Se usará el email para identificar el usuario a borar


export const deleteUser = async(ctx: deleteUserContext) => {
    try{
        const mail =ctx.params?.id;
        const usuario:UserSchema |undefined = await UserCollection.findOne({Email:mail});

        if(!usuario){
            //Si no encotramos al usuario se lo indicamos y 404
            ctx.response.status=404;
            ctx.response.body={message: "User not found"};
            return;
        }else if(usuario){
            //Si lo encontramos le mandamos un OK (200), lo borramos de la base de datos y se lo comentamos en el body
            ctx.response.status=200;            
            const deleted= await UserCollection.deleteOne({Email:mail});
            ctx.response.body={message:"User deleted at database succesfully"};
            return;
        }else{
            ctx.response.status=500;
            ctx.response.body={message: "Unexpected Error deleting"};
            return;
        }

    }catch(e){
        console.error(e)
        ctx.response.status=500;
        ctx.response.body=e;
    }
    
}
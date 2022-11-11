import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection,booksCollection,authorsCollection } from "../db/mongo.ts";
import { UserSchema,BookSchema,AuthorSchema } from "../db/schemas.ts";

type GetUserContext = RouterContext<
  "/getUser/:id",
  {
    id:string
  } &
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetBooksContext = RouterContext<
  "/getBooks",
  {
    id:string
  } &
  Record<string | number, string | undefined>,
  Record<string, any>
>;

//Retornaré el usuario si me introduce el DNI, el telefono, el email, el iban o el id

export const getUser = async (ctx: GetUserContext) => {
    try{        
        if (context.params?.id) {
            const user = await booksCollection.findOne({_id: new ObjectId(context.params.id),});
        }

        if(user){
            ctx.response.status=200;
            ctx.response.body=user;
            return;
        }else{
            ctx.response.status=404;
            ctx.response.body={message:"User not found"};
            return;
        }
    }catch(e){//Try catch para internal server error
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }
}

export const getBooks = async (ctx: GetBooksContext) => {
    try{        
        const params = getQuery(context, { mergeParams: true });

    }catch(e){//Try catch para internal server error
        
    }
}
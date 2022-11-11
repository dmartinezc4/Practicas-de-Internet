import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection,booksCollection,authorsCollection } from "../db/mongo.ts";
import { UserSchema,BookSchema,AuthorSchema } from "../db/schemas.ts";


type updateCartContext = RouterContext<
  "/updateCart",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const updateCart = async (ctx: updateCartContext) => {//Añade el libro al carrito del usuario si ambos libros existen
    try {
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        if(!value.id_book || !value.id_user){
            ctx.response.status=400;
            ctx.response.body={message:"Missing id_book or id_user"};
            return;
        }
        const book = await booksCollection.findOne({id: value.id_book});
        const user = await usersCollection.findOne({id: value.id_user});

        if(!book || !user){//Si alguno de los dos no existe salimos y 404
            ctx.response.status=404;
            ctx.response.body={message:"Book or user not found"};
            return;

        }else{// Si existe el libro y el usuario, lo metemos en el carrito
            await usersCollection.updateOne({id: value.id_user},{$push:{cart:book}});
            ctx.response.status=200;
            ctx.response.body={message:"Book added to cart"};
            return;
        }
    }catch(e){
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }
}
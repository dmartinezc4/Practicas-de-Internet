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

//Que me lo pase como un JSON, si alguno de los ids no existen le sacamos un error de no encontrado
//Si falta algun argumento al hacer la query le indicamos tambien el error
export const updateCart = async (ctx: updateCartContext) => {
    try {
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        if(!value.id_book || !value.id_user){
            ctx.response.status=400;
            ctx.response.body={message:"Missing id_book or id_user"};
            return;
        }
        const bookid=new ObjectId(value.id_book);
        const userid=new ObjectId(value.id_user);

        const book = await booksCollection.findOne({id: bookid});
        const user = await usersCollection.findOne({id: userid});

        
        if(book && user){// Si existe el libro y el usuario, lo metemos en el carrito
            await usersCollection.updateOne({id: userid},{$addToSet:{cart:bookid}});
            ctx.response.status=200;
            ctx.response.body={message:"Book added to cart"};
            return;
        }else if(book===undefined || user===undefined){//Si alguno de los dos no existe salimos y 404
            ctx.response.status=404;
            ctx.response.body={message:"Book or user not found"};
            return;

        }
        ctx.response.status=500;
        ctx.response.body={message:"Unexpected error"};
        return;

        
    }catch(e){
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }
}
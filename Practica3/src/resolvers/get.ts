import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { FindCursor } from "https://deno.land/x/mongo@v0.31.1/src/collection/commands/find.ts";
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

//Retornaré el user si me pasa el id de manera getUser/65452ba5455f , por ejemplo

export const getUser = async (ctx: GetUserContext) => {
    try{        
        if(ctx.params.id){
          const user:UserSchema|undefined = await usersCollection.findOne({_id: new ObjectId(ctx.params.id),});
          
          if(user){
              ctx.response.status=200;
              ctx.response.body=user;
              return;
          }else if(!user){
              ctx.response.status=404;
              ctx.response.body={message:"User not found"};
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
        ctx.response.body=e;
    }
}

//page y title son las keys, error si no me las pasa con valores 

export const getBooks = async (ctx: GetBooksContext) => {
    try{        
        const params = getQuery(ctx, { mergeParams: true });

        if(params?.title && !(params?.page)){
          //He considerado que devolverá todos los libros que tienen el nombre da igual en que página esté
          const libro= await booksCollection.find({title:params.title})
          ctx.response.status=200;
          ctx.response.body=libro;
          return;

        }else if(!(params?.title) && params?.page){
          //Las páginas van de diez en diez elementos
          //si me mete un numero negativo de página lo contare como si quisiese ver la página 0 
          const pagina=Number(params?.page);
          const limite=10;
          ctx.response.status=200; 
          const books=await booksCollection.find().skip(pagina>0?(pagina*limite):0).limit(limite);
          ctx.response.body=books;
          return;
        }else if(params?.title && params?.page){
          //Devolverá los libros que tengan mismo título y estén en la misma página
          const pagina=Number(params?.page);
          const limite=10;
          const titulo=params.title;
          const books=await booksCollection.find({title:titulo}).skip(pagina>0?(pagina*limite):0).limit(limite);
          const countbook=await booksCollection.find({title:titulo}).skip(pagina>0?(pagina*limite):0).limit(limite).toArray();
          
          if(countbook.length===0){
            ctx.response.status=404;
            ctx.response.body={message:"No such book in this page"};
            return;
          }
          ctx.response.status=200;
          ctx.response.body=books;
          return;
        }else{
          ctx.response.status=400;
          ctx.response.body={message:"Missing arguments or missing arguments' values"};
          return;
        }
    }catch(e){//Try catch para internal server error
      console.error(e);
      ctx.response.status=500;
      ctx.response.body=e;
    }
}
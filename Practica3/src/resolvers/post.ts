import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection,booksCollection,authorsCollection } from "../db/mongo.ts";
import { UserSchema,BookSchema,AuthorSchema } from "../db/schemas.ts";


type addUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type addAuthor = RouterContext<
  "/addAuthor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type addBook = RouterContext<
  "/addBook",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

//Que me pase el user como un json; si le falta algún campo le damos un error,
//si algún dato ya existe en la base de datos le comentamos que hay duplicidad y no lo añadimos

export const addUser = async (ctx: addUserContext) => {
    try {
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        if(!value.name || !value.pwd || !value.email){
            ctx.response.status = 400;
            ctx.response.body = { message: "Missing arguments" };
            return;
        }
        if(value.cart || value.created){
            ctx.response.status = 400;
            ctx.response.body = { message: "Arguments: cart and created are created by database" };
            return;
        }

        const now=new Date();
        const intnow=now.getTime();
        const user: Partial<User> = {
            //Me creo un un usuario con lo que me pasa
            name: value.name;
            email: value.email;//único
            pwd: value.pwd;             //La tenemos que cifrar
            created: intnow;
            cart: Book[];
            
        };

        if(await UserCollection.findOne({email:value.email})){//Entiendo que es lo único que no puede repetirse
            ctx.response.body = { message: "Email already in database" };
            ctx.response.status = 400;
            return;
        }else if{
            const add = await UserCollection.insertOne(user as UserSchema);
            ctx.response.body = { message: "User added succesfully" };
            ctx.response.status = 200;
            return;
        }

    }catch(e){
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }
}

//Que me pase el nomber del autor como un json;

export const addAuthor = async (ctx: addTransactionContext) => {

    try {
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        if(!value.name){
            ctx.response.status = 400;
            ctx.response.body = { message: "Missing arguments" };
            return;
        }
        if(value.id || value.books){
            ctx.response.status = 400;
            ctx.response.body = { message: "Only input name of author" };
            return;
        }

        const author: Partial<Author> = {
            id: 0; //Me genero yo un id único
            name:value.name;
            books: [];
            
        };

        const add = await authorsCollection.insertOne(author as AuthorSchema);
        ctx.response.body = { message: "Author added succesfully" };
        ctx.response.status = 200;
        return;


    }catch(e){
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }     
}

export const addBook = async (ctx: addTransactionContext) => {

    try {
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        if(!value.title || !value.author || !value.pages){
            ctx.response.status = 400;
            ctx.response.body = { message: "Missing arguments" };
            return;

        }else if(value.pages<0){
            ctx.response.status = 400;
            ctx.response.body = { message: "Pages must be greater than 0" };
            return;
        }
        if(value.ISBN){
            ctx.response.status = 400;
            ctx.response.body = { message: "ISBN is created by database" };
            return;
        }

        const book: Partial<Book> = {
            title: value.title; 
            author:value.author;
            pages: value.pages;
            ISBN: 0; //Tengo que hacer esto con uuid
        };

        const add = await booksCollection.insertOne(book as AuthorSchema);

        const autor= await authorsCollection.findOne({id:value.author.id});

        if(autor){//Si existe el mismo autor
            autor.books.push(book);
        }
        ctx.response.body = { message: "Book added succesfully" };
        ctx.response.status = 200;
        return;

    }catch(e){
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }     
}
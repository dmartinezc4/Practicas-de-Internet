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

type addAuthorContext = RouterContext<
  "/addAuthor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type addBookContext = RouterContext<
  "/addBook",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

//Que me pase el user como un json; si le falta algún campo le damos un error,
//si algún dato ya existe en la base de datos le comentamos que hay duplicidad y no lo añadimos

export const addUser = async (ctx: addUserContext) => { //Añade user
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

        const obid= ObjectId();
        const find= await usersCollection.findOne({id:value.obid});
        //Me genero un objectid nuevo para el el usuario
        //En caso de estar "genero" mas ids hasta que no esté en la base de datos

        while(find){
            obid= ObjectId();
            find= await usersCollection.findOne({id:value.obid});
        }


        const user: Partial<User> = {
            //Me creo un un usuario con lo que me pasa
            id: obid;
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

export const addAuthor = async (ctx: addAuthorContext) => { //Añade autor

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

        const obid= ObjectId();
        const find= await AuthorCollection.findOne({id:value.obid});
        //Me genero un objectid nuevo para el autor
        //En caso de estar "genero" mas ids hasta que no esté en la base de datos

        while(find){
            obid= ObjectId();
            find= await AuthorCollection.findOne({id:value.obid});
        }

        const author: Partial<Author> = {
            id: obid; //Esto es un objectid
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

export const addBook = async (ctx: addBookContext) => { //Añade libro y si el autor existe, modifica el array de libros del autor

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

        const obid= ObjectId();
        const find= await booksCollection.findOne({id:value.obid});
        //Me genero un objectid nuevo para el libro
        //En caso de estar "genero" mas ids hasta que no esté en la base de datos

        while(find){
            obid= ObjectId();
            find= await booksCollection.findOne({id:value.obid});
        }

        const book: Partial<Book> = {
            id:obid;
            title: value.title; 
            author:value.author;
            pages: value.pages;
            ISBN: 0; //Tengo que hacer esto con uuid
        };

        const add = await booksCollection.insertOne(book as bookSchema);

        const autor= await authorsCollection.findOne({id:value.author.id});

        if(autor){//Si existe el mismo autor
            await authorsCollection.updateOne({id: value.author.id},{$push:{books:book}});
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
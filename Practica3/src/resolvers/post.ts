import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection,booksCollection,authorsCollection } from "../db/mongo.ts";
import { UserSchema,BookSchema,AuthorSchema } from "../db/schemas.ts";
import {User,Author,Book} from "../types.ts"
import { v4 } from "https://deno.land/std@0.161.0/uuid/mod.ts";


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

//Que me pase el user como un json; si le falta nombre, contraseña o email le damos un error,
//si el email ya existe en la base de datos le comentamos que hay duplicidad y no lo añadimos

export const addUser = async (ctx: addUserContext) => { //Añade user
    try {
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        if(!value.name || !value.pwd || !value.email){
            ctx.response.status = 400;
            ctx.response.body = { message: "Missing arguments" };
            return;
        }
        if(value.cart || value.created||value.id){
            ctx.response.status = 400;
            ctx.response.body = { message: "Arguments: id, cart and created are created by database" };
            return;
        }
        
        const already= await usersCollection.findOne({email:value.email})

        if(already){//Entiendo que el email es lo único que no puede repetirse
            ctx.response.body = { message: "Email already in database" };
            ctx.response.status = 400;
            return;
        }

        const now=new Date();
        const intnow=now.getTime();
        //Esto permite pasar la fecha a number

        const encoder=new TextEncoder;

        const cifrada=encoder.encode(value.pwd);    
        //Esto me permite pasar la contraseña cifrada, la contraseña es un Unit8Array en los tipos tambien
        //el usuario me puede pasar tanto string como number     

        const carro:ObjectId[]=[];

        const user: Partial<User> = {
            name: value.name,
            email: value.email,//único
            pwd: cifrada,           
            created: intnow,
            cart: carro,
            
        };           
        
            const add = await usersCollection.insertOne(user as UserSchema);
            const find= await usersCollection.findOne({email:user.email});
            const addfinal= await usersCollection.updateOne({email:user.email},{$set:{id:find?._id}});
            ctx.response.body = { message: "User added succesfully" };
            ctx.response.status = 200;
            return;
        
        
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

        const already= await authorsCollection.findOne({name:value.name});//Busco si no está ya en la base de datos el nombre

        if(already){//Entiendo que el email es lo único que no puede repetirse
            ctx.response.body = { message: "Author name already in database" };
            ctx.response.status = 400;
            return;
        }

        const libros:ObjectId[]=[];

        const author: Partial<Author> = {
            name:value.name,
            books: libros,
            
        };

        const add = await authorsCollection.insertOne(author as AuthorSchema);
        const find= await authorsCollection.findOne({name:author.name});
        const addfinal= await authorsCollection.updateOne({name:author.name},{$set:{id:find?._id}});
        ctx.response.body = { message: "Author added succesfully" };
        ctx.response.status = 200;
        return;


    }catch(e){
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }     
}

export const addBook = async (ctx: addBookContext) => {
     //Si el autor existe añado el libro a la base de datos le modifico el id para que sea el de mongo
     //y luego lo meto en el array del autor
     //Los atributos del libro me los ha de pasar como un JSON

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
        if(value.ISBN || value.ISBN===0){
            ctx.response.status = 400;
            ctx.response.body = { message: "ISBN is created by database" };
            return;
        }
        if(value.id){
            ctx.response.status = 400;
            ctx.response.body = { message: "id is created by database" };
            return;
        }

        let found= await authorsCollection.findOne({name:value.author.name}&&{id:new ObjectId(value.author.id)});

        if(!found){
            ctx.response.status = 404;
            ctx.response.body = { message: "Author not in database. Check author name and author id" };
            return;
        }

        const myisbn=crypto.randomUUID();

        const book: Partial<Book> = {
            title: value.title,
            author: found,
            pages: value.pages,
            ISBN: myisbn, //Tengo que hacer esto con uuid
        };     

        const add = await booksCollection.insertOne(book as BookSchema);//Meto el libro

        const thebook= await booksCollection.findOne({title:book.title});//Busco el libro

        const addfinal= await booksCollection.updateOne({title:book.title},{$set:{id:thebook?._id}});

        const thebook2= await booksCollection.findOne({title:book.title});//Meto el libro en el array del autor


        await authorsCollection.updateOne({id: found.id},{$addToSet:{books:thebook2?.id}});

        ctx.response.body = { message: "Book added succesfully" };
        ctx.response.status = 200;
        return;

    }catch(e){
        console.error(e);
        ctx.response.status=500;
        ctx.response.body=e;
    }     
}
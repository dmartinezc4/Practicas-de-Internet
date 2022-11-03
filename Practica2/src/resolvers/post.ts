import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserCollection,TransactionCollection } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";
import { User } from "../types.ts";


type addUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type addTransactionContext = RouterContext<
  "/addTransaction",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


//Que me pase el user como un json; si le falta algún campo le damos un error,
//si algún dato ya existe en la base de datos le comentamos que hay duplicidad y no lo añadimos



export const addUser = async (ctx: addUserContext) => {
    try {
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        if(!value.DNI ||!value.Nombre ||!value.Apellidos ||!value.Telefono ||!value.Email ||!value.IBAN || !value.id){
            //Si no me pasa un parámetro, 400 y le digo que le faltan
            ctx.response.status = 400;
            ctx.response.body = { message: "Missing arguments" };
            return;
        }
        if(typeof (value.DNI)!=='string' ||typeof (value.Email)!=='string' ||
        typeof (value.Nombre)!=='string'||typeof (value.Apellidos)!=='string'||typeof (value.IBAN)!=='string'){
            ctx.response.status = 400;
            ctx.response.body = { message: "Incorrect datatype for dni, email, name or surnames. All have to be string" };
            return;
        }else if(!isNaN(Number(value.Telefono)) || !isNaN(Number(value.id))){
            ctx.response.status = 400;
            ctx.response.body = { message: "Incorrect datatype for phone number. It has to be a number" };
            return;
        }
        const user: Partial<User> = {
            //Me creo un un usuario con lo que me pasa
            DNI: value.DNI,
            Nombre: value.Nombre,
            Apellidos: value.Apellidos,
            Telefono: value.Telefono,
            Email: value.Email,
            IBAN: value.IBAN,
            id:value.id
            
        };
        //Aqui le saco un 400 cuando uno de los campos ya está siendo usado en la base de datos
        //Le digo especificamente cual le falta
        if(await UserCollection.findOne({DNI:value.DNI})){
            ctx.response.body = { message: "DNI already in database" };
            ctx.response.status = 400;
            return;
        }else if(await UserCollection.findOne({Telefono:value.Telefono})){
            ctx.response.body = { message: "Phone number already in database" };
            ctx.response.status = 400;
            return;
        }else if(await UserCollection.findOne({Email:value.Email})){
            ctx.response.body = { message: "Email already in database" };
            ctx.response.status = 400;
            return;
        }else if(await UserCollection.findOne({IBAN:value.IBAN})){
            ctx.response.body = { message: "IBAN already in database" };
            ctx.response.status = 400;
            return;
        }else if(await UserCollection.findOne({id:value.id})){
            ctx.response.body = { message: "Id already in database" };
            ctx.response.status = 400;
            return;
        }else{//Aqui ya lo que hago es anadir al usuario            
            const add = await UserCollection.insertOne(user as UserSchema);
            ctx.response.body = { message: "User added succesfully" };
            ctx.response.status = 200;
            return;
        }
        
    }catch(e){
        console.error(e);
        ctx.response.status=500;
    }
}

//Que me pase la transaccion como un json;

export const addTransaction = async (ctx: addTransactionContext) => {

    try {
        const result = ctx.request.body({ type: "json" });
        const value = await result.value;

        if(!value.id_sender || !value.id_receiver){
            //Si en la base de datos no tenemos el id del emisor o del receptor, bad request y salimos
            ctx.response.status=400;
            ctx.response.body={message:"Receiver id or Sender id missing"};
            return;

        }else if(!value.amount ||value.amount<=0 ){
            //Si no hay transaccion o son igual o menores que 0, bad request y salimos
            ctx.response.status=400;
            ctx.response.body={message:"Transactions need to have a positive value"};
            return;

        }else if(value.id_sender === value.id_receiver){
            //Considero que una persona no puede realizarse una transaccion a si mismo
            ctx.response.status=400;
            ctx.response.body={message:"Sender and receiver need to have diferent ids"};
            return;

        }
        const sender:UserSchema |undefined = await UserCollection.findOne({id:value.id_sender});
        const receiver:UserSchema |undefined = await UserCollection.findOne({id:value.id_receiver});

        //Considero que para esta práctica los ids tanto del receptor como del emisor han de estar en la UserCollection
        //En caso de que el id de cualquiera de los dos no esté en la base de datos, not found y salimos
        if(!sender){
            ctx.response.status=404;
            ctx.response.body={message:"Sender user not found"};
            return;

        }else if(!receiver){
            ctx.response.status=404;
            ctx.response.body={message:"Receiver user not found"};
            return;

        }else{
            const transaction = await TransactionCollection.insertOne(value);
            ctx.response.status = 200;
            ctx.response.body = transaction;
            ctx.response.body = { message: "Transaction added succesfully" };
            return;

        }        
    }catch(e){
        console.error(e)
        ctx.response.status=500;
    }     
}
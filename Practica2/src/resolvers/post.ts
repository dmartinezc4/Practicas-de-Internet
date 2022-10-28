import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserCollection,TransactionCollection } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";


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


//Que me pase el user como un json


export const addUser = async (ctx: addUserContext) => {
    try {
        const result = ctx.request.body({ type: "json" }); 
        const value = await result.value;
        const user: Partial<User> = {
                DNI: value.DNI,
                Nombre: value.Nombre,
                Apellidos: value.Apellidos,
                Telefono: value.Telefono,
                Email: value.Email,
                IBAN: value.IBAN,
                id: value.id
        };  
            const id = await UserCollection.insertOne(user as UserSchema);
            ctx.response.body = { message: "User added succesfully" };
            user.id= id.toString();
            ctx.response.status = 200;
            return;
    }catch(e){
        console.error(e);
        ctx.response.status=500;
    }
}

//Que me pase la transaccion como un json

export const addTransaction = async (ctx: addTransactionContext) => {

    try {
        const result = ctx.request.body({ type: "json" });
        const value = await result.value;
        const transaction = await TransactionCollection.insertOne(value);
        ctx.response.status = 200;
        ctx.response.body = transaction;
        ctx.response.body = { message: "Transaction added succesfully" };
        return;
    }catch(e){
        console.error(e)
        ctx.response.status=500;
    }

     
}
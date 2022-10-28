import {MongoClient,Database} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { UserSchema } from "./schemas.ts";
import { TransactionSchema } from "./schemas.ts";
  
  const connectMongoDB = async (): Promise<Database> => {

/*
    const mongo_usr = "UsuarioPrime";
    const mongo_pwd = "admin_1234";
    const db_name = "banco";
    const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster-nebrija.gcxdd.gcp.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`;
  

*/

    const client = new MongoClient();
    await client.connect("mongodb+srv://UsuarioPrime:admin_1234@nebrija.mjaye9w.mongodb.net/?authMechanism=SCRAM-SHA-1");
    const db = client.database("Banco");
    return db;
  };
  
  const db = await connectMongoDB();
  
  export const UserCollection = db.collection<UserSchema>("Users");
  export const TransactionCollection = db.collection<TransactionSchema>("Transactions");
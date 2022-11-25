import {MongoClient,Database} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { SellerSchema,CarSchema,CarDealerSchema } from "./schemas.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
    const mongo_usr = Deno.env.get("MONGO_USR");
    //console.log(mongo_usr);
    const mongo_pwd = Deno.env.get("MONGO_PWD");
    //console.log(mongo_pwd);
    const db_name = Deno.env.get("DB_NAME");
    //console.log(db_name);
    const mongo_uri = Deno.env.get("MONGO_URI");
    //console.log(mongo_uri); 

    const mongo_url= Deno.env.get("MONGO_URL")
    console.log(mongo_url);

/*

    if (!mongo_usr || !mongo_pwd || !db_name || !mongo_url) {
        throw new Error(
          "Missing environment variables, check env.sample for creating .env file"
        );
    }
  */  

    const client = new MongoClient();
    await client.connect(mongo_url);
    const db = client.database(db_name);
    return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const sellersCollection = db.collection<SellerSchema>("Sellers");
export const carsCollection = db.collection<CarSchema>("Cars");
export const carDealersCollection = db.collection<AuthorSchema>("CarDealers");
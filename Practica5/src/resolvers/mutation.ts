import { ObjectId } from "mongo";
import { usersCollection,messageCollection } from "../db/dbconnection.ts";
import { UserSchema } from "../db/schema.ts";
import { User } from "../types.ts";
import * as bcrypt from "bcrypt";
import { createJWT } from "../lib/jwt.ts";

export const Mutation = {
   
   
    createUser:async(_:unknown, args:{username: string, password: string},ctx:{language:number}):Promise<UserSchema> =>{
        try{
            const user= await usersCollection.findOne({username:args.username});
            if(user){
                throw new Error("Username already taken");
            }
            

            const pass= await bcrypt.hash(args.password);
            const _id=new ObjectId();
            const date=new Date().getTime();
            const token = createJWT(
                {
                    username:args.username,
                    email:"a@b",
                    id:_id.toString(),
                    created:date,
                    language:ctx.language,
                    password:pass
                },
                Deno.env.get("JWT_SECRET")!
            
            );
            const newUser:UserSchema={
                _id,
                username:args.username,
                email:"a@b",
                id:_id.toString(),
                created:date,
                language:ctx.language,
                password:pass
            };
            await usersCollection.insertOne(newUser);
            return{
                ...newUser
            };

        }catch(e){
            throw new Error(e);
        }
    }
    
};
import { carsCollection,sellersCollection,carDealersCollection } from "../db/database.ts";
import { ObjectId } from "mongo";
import { Car,Seller,CarDealer } from "../types.ts";
import { CarSchema, CarDealerSchema, SellerSchema } from "../db/schemas.ts";


export const Query={
    getCars:async()=>{
        try{
            const exist=await carsCollection.find().toArray();
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getCarsBudget:async(_:unknown,args:{min:number,max:number})=>{
        try{
            if(args.min>args.max){
                throw new Error("Min has to be lower than max");
            }
            const exist=await carsCollection.find({price:{$gte:args.min,$lte:args.max}}).toArray();
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getCar:async(_:unknown, args:{plate:string})=>{
        try{
            const exist= await carsCollection.findOne({plate:args.plate})
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getCarBudget:async(_:unknown,args:{min:number,max:number})=>{
        try{
            if(args.min>args.max){
                throw new Error("Min has to be lower than max");
            }
            const exist=await carsCollection.findOne({price:{$gte:args.min,$lte:args.max}});
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getCarDealers:async(_:unknown)=>{
        try{
            const exist= await carDealersCollection.find().toArray();
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        
        }
    },
    getCarDealer:async(_:unknown, args:{cif:string})=>{
        try{
            const exist= await carDealersCollection.findOne({cif:args.cif});
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        
        }
    },
    getSellers:async(_:unknown)=>{
        try{           
            const exist= await sellersCollection.find().toArray();
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getSeller:async(_:unknown, args:{dni:string})=>{
        try{
            const exist= await sellersCollection.findOne({dni:args.dni});
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getSellersName:async(_:unknown, args:{name:string})=>{
        try{           
            const exist= await sellersCollection.find({name:args.name}).toArray();
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getSellerName:async(_:unknown, args:{name:string})=>{
        try{           
            const exist= await sellersCollection.findOne({name:args.name});
            return exist;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    }
    
}
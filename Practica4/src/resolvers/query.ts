import { carsCollection,sellersCollection,carDealersCollection } from "../db/database.ts";
import { ObjectId } from "mongo";
import { Car,Seller,CarDealer } from "../types.ts";
import { CarSchema, CarDealerSchema, SellerSchema } from "../db/schemas.ts";


export const Query={
    getCars:async(_:unknown, args:{plate?:string,min?:number,max?:number})=>{
        try{
            if(args.plate){//Hay matricula
                if(args.min && !args.max){//Opciones de rango de precio
                    const exist= await carsCollection.find({plate:args.plate,price:{$gte:args.min}});
                    return exist;
                }
                else if(args.min && args.max){
                    const exist= await carsCollection.find({plate:args.plate,price:{$gte:args.min,$lte:args.max}});
                    return exist;
                }
                else if(!args.min && args.max){
                    const exist= await carsCollection.find({plate:args.plate,price:{$lte:args.max}});
                    return exist;
                }else{
                    const exist= await carsCollection.find({plate:args.plate});
                    return exist;
                }
            }else{//Si no pasa cif pasamos los coches por el precio
                if(args.min && !args.max){//Opciones de rango de precio
                    const exist= await carsCollection.find({price:{$gte:args.min}});
                    return exist;
                }
                else if(args.min && args.max){
                    const exist= await carsCollection.find({price:{$gte:args.min,$lte:args.max}});
                    return exist;
                }
                else if(!args.min && args.max){
                    const exist= await carsCollection.find({price:{$lte:args.max}});
                    return exist;
                }else{//Aqui no hay ni cif ni rango de precio asi que devolvemos todos los coches
                    const exist= await carsCollection.find();
                    return exist;
                }
            }
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getCar:async(_:unknown, args:{plate?:string,min?:number,max?:number})=>{
        try{
            if(args.plate){//Hay matricula
                if(args.min && !args.max){//Opciones de rango de precio
                    const exist= await carsCollection.findOne({plate:args.plate,price:{$gte:args.min}});
                    return exist;
                }
                else if(args.min && args.max){
                    const exist= await carsCollection.findOne({plate:args.plate,price:{$gte:args.min,$lte:args.max}});
                    return exist;
                }
                else if(!args.min && args.max){
                    const exist= await carsCollection.findOne({plate:args.plate,price:{$lte:args.max}});
                    return exist;
                }else{
                    const exist= await carsCollection.findOne({plate:args.plate});
                    return exist;
                }
            }else{//Si no pasa cif pasamos los coches por el precio
                if(args.min && !args.max){//Opciones de rango de precio
                    const exist= await carsCollection.findOne({price:{$gte:args.min}});
                    return exist;
                }
                else if(args.min && args.max){
                    const exist= await carsCollection.findOne({price:{$gte:args.min,$lte:args.max}});
                    return exist;
                }
                else if(!args.min && args.max){
                    const exist= await carsCollection.findOne({price:{$lte:args.max}});
                    return exist;
                }else{//Aqui no hay ni cif ni rango de precio asi que devolvemos todos los coches
                    return null;
                }
            }
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getCarDealers:async(_:unknown, args:{cif?:string,postcode?:string})=>{
        try{
            if(args.cif){//Hay cif
                if(args.postcode){//Tiene codigo postal
                    const exist= await carDealersCollection.find({cif:args.cif,postcode:args.postcode});
                    return exist;
                }
                else{
                    const exist= await carDealersCollection.find({cif:args.cif});
                    return exist;
                }
            }else{//Si no le pasamos cif
                if(args.postcode){//Tiene codigo postal
                    const exist= await carDealersCollection.find({postcode:args.postcode});
                    return exist;
                }
                else{
                    const exist= await carDealersCollection.find();
                    return exist;
                }
            }
        }catch(error){
            console.log(error);
            throw new Error(error);
        
        }
    },
    getCarDealer:async(_:unknown, args:{cif?:string,postcode?:string})=>{
        try{
            if(args.cif){//Hay cif
                if(args.postcode){//Tiene codigo postal
                    const exist= await carDealersCollection.findOne({cif:args.cif,postcode:args.postcode});
                    return exist;
                }
                else{
                    const exist= await carDealersCollection.findOne({cif:args.cif});
                    return exist;
                }
            }else{//Si no le pasamos cif
                if(args.postcode){//Tiene codigo postal
                    const exist= await carDealersCollection.findOne({postcode:args.postcode});
                    return exist;
                }
                else{
                    return null;
                }
            }
        }catch(error){
            console.log(error);
            throw new Error(error);
        
        }
    },
    getSellers:async(_:unknown, args:{dni?:string,name?:string})=>{
        try{
            if(args.dni){//Hay dni
                if(args.name){
                    const exist= await sellersCollection.find({dni:args.dni,name:args.name});
                    return exist;
                }
                else{
                    const exist= await sellersCollection.find({dni:args.dni});
                    return exist;
                }
            }else{//Si no le pasamos dni
                if(args.name){
                    const exist= await sellersCollection.find({name:args.name});
                    return exist;
                }
                else{//Le pasamos todo
                    const exist= await sellersCollection.find();
                    return exist;
                }
            }

        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getSeller:async(_:unknown, args:{dni?:string,name?:string})=>{
        try{
            if(args.dni){//Hay dni
                if(args.name){
                    const exist= await sellersCollection.findOne({dni:args.dni,name:args.name});
                    return exist;
                }
                else{
                    const exist= await sellersCollection.findOne({dni:args.dni});
                    return exist;
                }
            }else{//Si no le pasamos dni
                if(args.name){
                    const exist= await sellersCollection.findOne({name:args.name});
                    return exist;
                }
                else{//Le pasamos todo
                    return null;
                }
            }
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    }
    
}
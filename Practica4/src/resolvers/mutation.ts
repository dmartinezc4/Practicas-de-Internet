import { carsCollection,sellersCollection,carDealersCollection } from "../db/database.ts";
import { ObjectId } from "mongo";
import { Car,Seller,CarDealer } from "../types.ts";

export const Mutation={
    createCar:async(_:unknown, args:{plate:string,brand:string,seats:number,doors:number,price:number}):Promise<Car>=>{
        try{
            const exists= await carsCollection.findOne({plate:args.plate});
            if(exists){
                throw new Error("Car already exists");
            }
            console.log("Coche no en base de datos")
            const car = await carsCollection.insertOne({
                plate:args.plate,
                brand:args.brand,
                seats:args.seats,
                doors:args.doors,
                price:args.price
            });
            return{
                plate:args.plate,
                brand:args.brand,
                seats:args.seats,
                doors:args.doors,
                price:args.price
            };
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    createSeller:async(_:unknown, args:{dni:string,name:string,age:number}):Promise<Seller>=>{
        try{
            const exists= await sellersCollection.findOne({dni:args.dni});
            if(exists){
                throw new Error("Seller already exists");
            }
            const coches:Car[]=[];

            const seller = await sellersCollection.insertOne({
                dni:args.dni,
                name:args.name,
                age:args.age,
                cars:coches
            });
            return{
                dni:args.dni,
                name:args.name,
                age:args.age,
                cars:coches
            };
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    createCarDealer:async(_:unknown, args:{cif:string,name:string,postcode:string}):Promise<Seller>=>{
        try{
            const exists= await carDealersCollection.findOne({cif:args.cif});
            if(exists){
                throw new Error("CarDealer already exists");
            }
            const coches:Car[]=[];
            const vendedores:Seller[]=[];

            const seller = await carDealersCollection.insertOne({
                cif:args.cif,
                name:args.name,
                postcode:args.postcode,
                cars:coches,
                sellers:vendedores
            });
            return{
                cif:args.cif,
                name:args.name,
                postcode:args.postcode,
                cars:coches,
                sellers:vendedores
            };
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    //Añadir vendedor a concesionario
    addSellerToCarDealer:async(_:unknown, args:{dni:string,cif:string}):Promise<CarDealer>=>{
        try{
            const carDealer = await carDealersCollection.findOne({cif:args.cif});
            if(!carDealer){
                throw new Error("CarDealer does not exist");
            }
            const seller = await sellersCollection.findOne({dni:args.dni});
            if(!seller){
                throw new Error("Seller does not exist");
            }
            const carDealerUpdated = await carDealersCollection.updateOne(
                {cif:args.cif},
                {$push:{sellers:seller}}
            );
            return{
                cif:carDealer.cif,
                name:carDealer.name,
                postcode:carDealer.postcode,
                cars:carDealer.cars,
                sellers:carDealerUpdated.sellers
            };
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    //Añadir coche a vendedor
    addCarToSeller:async(_:unknown, args:{plate:string,dni:string}):Promise<Seller>=>{
        try{
            const car = await carsCollection.findOne({plate:args.plate});
            if(!car){
                throw new Error("Car does not exist");
            }
            const seller = await sellersCollection.findOne({dni:args.dni});
            if(!seller){
                throw new Error("Seller does not exist");
            }
            const sellerUpdated = await sellersCollection.updateOne(
                {dni:args.dni},
                {$push:{cars:car}}
            );
            return{
                dni:seller.dni,
                name:seller.name,
                age:seller.age,
                cars:sellerUpdated.cars
            };
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    }

}
import { carsCollection,sellersCollection,carDealersCollection } from "../db/database.ts";
import { ObjectId } from "mongo";
import { Car,Seller,CarDealer } from "../types.ts";

export const Mutation={
    createCar:async(_:unknown, args:{plate:string,brand:string,seats:number,doors:number,price:number}):Promise<Car>=>{
        try{
            if(!args.plate || !args.brand || !args.seats|| !args.doors || !args.price){
                throw new Error("Missing arguments");
            }
            const exists= await carsCollection.findOne({plate:args.plate});
            if(exists){
                throw new Error("Car already exists");
            }
            console.log("Coche no en base de datos");

            //Sample plate: 1234DHL
            if(args.plate.length!=7){
                throw new Error("Plate has to have 4 numbers followed by 3 capital letters");
            }
            const platenumbers= Number(args.plate.substring(0,4));
            const plateletters= args.plate.substring(4);
            if(isNaN(platenumbers)){
                throw new Error("Bad input, some of the plate numbers are letters");
            }

            for(var val of plateletters){
                if(!isNaN(Number(val))){
                    throw new Error("Bad input, some of the letters are numbers");
                }
            }
            if(plateletters!==plateletters.toUpperCase()){
                throw new Error("Bad input, some of the letters are not capitalized");
            }

            if(args.seats<1){
                throw new Error("Car must have at least one seat to be driven");
            }
            if(args.doors<1){
                throw new Error("Car must have at least one door to enter");
            }
            if(args.price<0){
                throw new Error("Car must have a positive price");
            }

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
            if(!args.dni || !args.name || !args.age){
                throw new Error("Missing arguments");
            }
            const exists= await sellersCollection.findOne({dni:args.dni});
            if(exists){
                throw new Error("Seller already exists");
            }

            //Dni example=12345678A
            if(args.dni.length!==9){
                throw new Error("Dni has 8 numbers then followed by a letter");
            }

            const dninumbers= Number(args.dni.substring(0,8));
            const dniletter = args.dni.substring(8);

            if(isNaN(dninumbers)){
                throw new Error("Bad input, some of the dni numbers are letters");
            }
            
            if(!isNaN(Number(dniletter))){
                throw new Error("Bad input, the letter is a number");
            }
            
            if(dniletter!==dniletter.toUpperCase()){
                throw new Error("Bad input, the letter is not capitazlized");
            }

            if(args.age<12 || args.age>120){
                throw new Error
                ("Under 12 years could be considered child labor; life expectancy is not that high as more than 120 years old");
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
    createCarDealer:async(_:unknown, args:{cif:string,name:string,postcode:string}):Promise<CarDealer>=>{
        try{
            if(!args.cif || !args.name || !args.postcode){
                throw new Error("Missing arguments");
            }
            const exists= await carDealersCollection.findOne({cif:args.cif});
            if(exists){
                throw new Error("CarDealer already exists");
            }

            //Cif example= A12345678
            if(args.cif.length!==9){
                throw new Error("Cif has to have a letter followed by 8 numbers");
            }
            const cifletter=args.cif.substring(0,1);
            const cifnumbers=Number(args.cif.substring(1));

            if(!isNaN(Number(cifletter))){
                throw new Error("Letter has to be a letter");
            }
            if(cifletter!==cifletter.toUpperCase()){
                throw new Error("Letter has to be capitalized");
            }

            if(isNaN(cifnumbers)){
                throw new Error("Some of the numbers are not numbers");
            }
            //Postcode example = 12345
            if(args.postcode.length!==5){
                throw new Error("Postcodes have 5 numbers");
            }
            if(isNaN(Number(args.postcode))){
                throw new Error("Postcodes only have numbers");
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
            const dni=seller.dni;

            //A seller works only with one cardealer, so if its already on a cardealer 
            const already= await carDealersCollection.findOne({sellers: [dni]});
            if(already){
                throw new Error("Seller already working in a carDealer")
            }
            const sellercars=seller.cars;
            if(sellercars.length===0){//Seller has no cars
                const carDealerUpdated = await carDealersCollection.updateOne(
                    {cif:args.cif},
                    {$addToSet:{sellers:seller}}
                );
                const carDealer1= await carDealersCollection.findOne({cif:args.cif});
                return{
                    cif:carDealer.cif,
                    name:carDealer.name,
                    postcode:carDealer.postcode,
                    cars:carDealer.cars,
                    sellers:carDealer.sellers
                };
            }else{//The idea is to have a carDealer empty, then add empty sellers
                throw new Error("First create carDealers, then sellers and add them to the carDealer");
            }

            
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
            const dni=seller.dni;
            const plate=car.plate;

            const dealer= await carDealersCollection.findOne({ sellers:{$elemMatch:{dni:dni}} })
            if(!dealer){
                throw new Error("Seller has to work in a cardealer to add a car");
            }
            const sellerUpdated = await sellersCollection.updateOne(
                {dni:args.dni},
                {$addToSet:{cars:car}}
            );
            const dealerupdate= await carDealersCollection.updateOne(
                {cif:dealer.cif},
                {$addToSet:{cars:car}}) ;
            const seller1 = await sellersCollection.findOne({dni:args.dni});
            return{
                dni:seller.dni,
                name:seller.name,
                age:seller.age,
                cars:seller.cars
            };
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    }

}
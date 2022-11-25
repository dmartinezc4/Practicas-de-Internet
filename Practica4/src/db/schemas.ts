import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import {Seller, Car, CarDealer} from "../types.ts";

export type SellerSchema = Seller & {_id: ObjectId};
export type CarSchema = Car & {_id: ObjectId};
export type CarDealerSchema = CarDealer & {_id: ObjectId};
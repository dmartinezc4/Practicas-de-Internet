import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { User } from "../types.ts";
import { Transaction } from "../types.ts";

export type UserSchema = Omit<User, "id"> & { _id: ObjectId };
export type TransactionSchema = Omit<Transaction, "id"> & { _id: ObjectId };
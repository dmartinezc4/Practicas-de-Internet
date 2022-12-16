import { User,Message } from "../types.ts";
import { ObjectId } from "mongo";

export type UserSchema = User & {
  _id: ObjectId;
};

export type MessageSchema= Message & {
    _id: ObjectId;
};

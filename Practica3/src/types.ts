import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export type User = {
id: ObjectId;
name: string;
email: string;//único
pwd: number; //Cifrada
created: number;
cart: Book[];
};

export type Book = {
id: ObjectId;
title: string;
author: Author;
pages: number;
ISBN: number;
};

export type Author = {
id: ObjectId;
name: string;
books: number;
};
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export type User = {
id: ObjectId;
name: string;
email: string;//único
pwd: Uint8Array; //Cifrada
created: number;
cart: ObjectId[];//De los libros
};

export type Book = {
id: ObjectId;
title: string;
author: Author;
pages: number;
ISBN: string;
};

export type Author = {
id: ObjectId;
name: string;
books: ObjectId[];//De los libros
};
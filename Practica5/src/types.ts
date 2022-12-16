export type User = {
    id: string;
    username: string;
    email?: string;
    password: string;
    language: number;
    created: number;
    token?: string;
};

export type Message={
    id:string;
    content:string;
    sender:string;//id de mongo
    receiver:string;//id de mongo
}
export type Seller={
    dni:string,//único
    name:string,
    age:number,
    cars:Car[]
}
export type Car={
    plate:string,//único
    brand:string,
    seats:number,
    doors:number,
    price:number,

}

export type CarDealer={
    cif:string,//único este es el "dni" de las empresas
    name:string,
    postcode:string,
    cars:Car[],
    sellers:Seller[]
}
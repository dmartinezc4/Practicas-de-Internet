export type User ={
    DNI: string;
    Nombre: string;
    Apellidos: string;
    Telefono: number;
    Email: string;
    IBAN: string;
    id: number;
}

export type Transaction ={
    id_sender: number;
    id_receiver: number;
    amount: number;
}
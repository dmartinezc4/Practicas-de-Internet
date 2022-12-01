import { gql } from "graphql_tag";

export const typeDefs = gql`
    type Car {
        plate: String!
        name: String!
        brand: String!
        seats: Int!
        doors: Int!
    }
    type Seller {
        dni: String!
        name: String!
        age: Int!
        cars: [Car]
    }
    type CarDealer {
        cif: String!
        name: String!
        postcode: String!
        cars: [Car]
        sellers: [Seller]
    }
    type Query {
        getCars: [Car!]!
        getCarsBudget(min:Int!,max:Int!):[Car]
        getCar(plate: String!): Car
        getCarBudget(min:Int!,max:Int!):Car!
        getSellers: [Seller!]!
        getSeller(dni:String!):Seller
        getSellersName(name:String!):[Seller!]!
        getSellerName(name:String!):Seller
        getCarDealers: [CarDealer!]!
        getCarDealer(cif: String!): CarDealer
    }
    type Mutation {
        createCar(plate: String!, brand: String!, seats: Int!, doors: Int!, price: Int!): Car!
        createSeller(dni: String!, name: String!, age: Int!): Seller!
        createCarDealer(cif: String!, name: String!, postcode: String!): CarDealer!
        addCarToSeller(dni: String!, plate: String!): Seller!
        addSellerToCarDealer(cif: String!, dni: String!): CarDealer!
    }
`;
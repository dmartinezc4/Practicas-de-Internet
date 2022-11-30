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
        getCar(id: ID!): Car
        getSellers: [Seller!]!
        getSeller(id: ID!): Seller
        getCarDealers: [CarDealer!]!
        getCarDealer(id: ID!): CarDealer
    }
    type Mutation {
        createCar(plate: String!, brand: String!, seats: Int!, doors: Int!, price: Int!): Car!
        createSeller(dni: String!, name: String!, age: Int!): Seller!
        createCarDealer(cif: String!, name: String!, postcode: String!): CarDealer!
        addCarToSeller(dni: String!, plate: String!): Seller!
        addSellerToCarDealer(cif: String!, dni: String!): CarDealer!
    }
`;
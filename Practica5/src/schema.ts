import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String
    laguage: Int!
    surname: String!
    token: String
    created:Int!
  }

  type Message {
    id: ID!
    content:String!
    sender:String!
    receiver:String!
  }
  type Query {
    getUsers:[User!]!
    getMessages(page:Int!,perPage:Int!): [Message!]!
  }
  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): String!
    deleteUser(username:String!):User!
    sendMessage(username:String!):Message!    
  }
`;
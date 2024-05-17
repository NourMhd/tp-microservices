

// Définir le schéma GraphQL pour les magazines
import { gql } from '@apollo/server';

const typeDefs = gql`

  type Magazine {
    id: ID!
    title: String!
    description: String!
    category: String
    publisher: String
  }

  type Query {
    magazine(id: ID!): Magazine
    magazines: [Magazine]
    searchMagazines(query: String!): [Magazine]
  }
`;

export default typeDefs;

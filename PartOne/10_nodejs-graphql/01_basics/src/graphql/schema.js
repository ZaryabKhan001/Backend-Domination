export const schema = `#graphql
    type Product {     
        id: ID!,
        title: String!,
        category: String!,
        price: Float!,
        inStock: Boolean!
    }

    type Query {
        products: [Product!]!,
        product(id: ID!): Product
    }
    type Mutation {
        createProduct(
        title: String!
        category: String!
        price: Float!
        inStock: Boolean!
        ): Product
        deleteProduct(id: ID!): Boolean
        updateProduct(
        id: ID!
        title: String
        category: String
        price: Float
        inStock: Boolean
        ): Product
  }
`;

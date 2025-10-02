export const createUser = `#graphql
    mutation Mutation($name: String!, $email: String!) {
        newUser(name: $name, email: $email)
}`;

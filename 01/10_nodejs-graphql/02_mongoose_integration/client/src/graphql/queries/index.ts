export const getUsers = `#graphql
    query GETUSERS {
        users {
            _id
            name
            email
    }
}`;

export const getCourses = `#graphql
    query GETCOURSES {
        courses {
            _id
            title
            description
            price
    }
}`;

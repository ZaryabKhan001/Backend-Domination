export const graphQLSchema = `#graphql
    scalar DateTime

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        googleId: String
        role: String!
        avatar: String
        verified: Boolean!
        createdAt: DateTime!
        updatedAt: DateTime!
        enrolledCourses: [Course!]
    }

    type Course {
        _id: ID!
        title: String!
        description: String!
        instructor: User!
        price: Float!
        sections: [Section!]
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type Section {
        _id: ID!
        title: String!
        course: Course!
        lectures: [Lecture!]
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type Lecture {
        _id: ID!
        title: String!
        videoUrl: String!
        duration: Int
        section: Section!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type Query {
        users: [User!]
        user(id: ID!): User
        courses: [Course!]
        course(id: ID!): Course
        sections(courseId: ID!): [Section!]
        lectures(sectionId: ID!): [Lecture!]
    }

    type Mutation {
        newUser(name: String!, email: String!): String
    }
`;

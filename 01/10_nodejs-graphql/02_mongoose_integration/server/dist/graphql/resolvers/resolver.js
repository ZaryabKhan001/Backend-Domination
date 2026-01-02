import { getAllUsers, getUser, getCoursesByUser, createUser, } from '../../controllers/user.controller.js';
import { getAllCourses, getCourse, } from '../../controllers/course.controller.js';
export const graphQLResolver = {
    Query: {
        users: getAllUsers,
        courses: getAllCourses,
        course: getCourse,
    },
    User: {
        enrolledCourses: async (user) => {
            return await getCoursesByUser(String(user._id));
        },
    },
    Course: {
        instructor: async (course) => {
            return await getUser(String(course.instructor));
        },
    },
    Mutation: {
        newUser: async (_parent, { name, email }) => {
            const result = await createUser({ name, email });
            if (!result) {
                return 'Error in creating User';
            }
            return 'User created Successfully';
        },
    },
};
//# sourceMappingURL=resolver.js.map
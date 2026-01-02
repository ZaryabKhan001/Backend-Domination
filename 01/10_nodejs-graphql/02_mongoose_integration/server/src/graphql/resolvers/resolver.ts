import {
  getAllUsers,
  getUser,
  getCoursesByUser,
  createUser,
} from '../../controllers/user.controller.js';
import {
  getAllCourses,
  getCourse,
} from '../../controllers/course.controller.js';
import { IUser } from '../../models/user.model.js';
import { ICourse } from '../../models/course.model.js';
export const graphQLResolver = {
  Query: {
    users: getAllUsers,
    courses: getAllCourses,
    course: getCourse,
  },

  User: {
    enrolledCourses: async (user: IUser) => {
      return await getCoursesByUser(String(user._id));
    },
  },

  Course: {
    instructor: async (course: ICourse) => {
      return await getUser(String(course.instructor));
    },
  },

  Mutation: {
    newUser: async (
      _parent: any,
      { name, email }: { name: string; email: string }
    ) => {
      const result = await createUser({ name, email });
      if (!result) {
        return 'Error in creating User';
      }
      return 'User created Successfully';
    },
  },
};

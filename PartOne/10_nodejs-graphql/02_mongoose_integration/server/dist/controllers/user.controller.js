import Course from '../models/course.model.js';
import User from '../models/user.model.js';
const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    }
    catch (error) {
        console.error(error);
    }
};
const getUser = async (id) => {
    try {
        const user = await User.findById({ id });
        return user;
    }
    catch (error) {
        console.error(error);
    }
};
const getCoursesByUser = async (id) => {
    try {
        const courses = await Course.find();
        return courses;
    }
    catch (error) {
        console.error(error);
    }
};
const createUser = async ({ name, email }) => {
    try {
        const user = await User.create({
            name,
            email,
        });
        await user.save();
        return user;
    }
    catch (error) {
        console.error(error);
    }
};
export { getAllUsers, getUser, getCoursesByUser, createUser };
//# sourceMappingURL=user.controller.js.map
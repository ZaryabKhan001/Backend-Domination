import Course from '../models/course.model.js';

export const getAllCourses = async () => {
  try {
    const courses = await Course.find();
    return courses;
  } catch (error) {
    console.error(error);
  }
};

export const getCourse = async (parent: any, arg: { id: string }) => {
  try {
    const course = await Course.findById(arg.id);
    return course;
  } catch (error) {
    console.error(error);
  }
};

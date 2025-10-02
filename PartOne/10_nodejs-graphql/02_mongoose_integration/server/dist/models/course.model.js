import mongoose, { Schema } from 'mongoose';
const courseSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: { type: Number, required: true },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
}, { timestamps: true });
const Course = mongoose.model('Course', courseSchema);
export default Course;
//# sourceMappingURL=course.model.js.map
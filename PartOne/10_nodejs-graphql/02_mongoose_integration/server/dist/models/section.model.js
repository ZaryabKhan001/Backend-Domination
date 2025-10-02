import mongoose, { Schema } from 'mongoose';
const sectionSchema = new Schema({
    title: { type: String, required: true, trim: true },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
}, { timestamps: true });
const Section = mongoose.model('Section', sectionSchema);
export default Section;
//# sourceMappingURL=section.model.js.map
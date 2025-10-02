import mongoose, { Schema } from 'mongoose';
const lectureSchema = new Schema({
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
    },
}, { timestamps: true });
const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;
//# sourceMappingURL=lecture.model.js.map
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILecture extends Document {
  title: string;
  videoUrl: string;
  duration?: number;
  section: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema: Schema<ILecture> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
  },
  { timestamps: true }
);

const Lecture: Model<ILecture> = mongoose.model<ILecture>(
  'Lecture',
  lectureSchema
);
export default Lecture;

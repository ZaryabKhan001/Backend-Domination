import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISection extends Document {
  title: string;
  course: mongoose.Types.ObjectId;
  lectures: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema: Schema<ISection> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
  },
  { timestamps: true }
);

const Section: Model<ISection> = mongoose.model<ISection>(
  'Section',
  sectionSchema
);
export default Section;

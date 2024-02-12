import { Schema, model, models, Document } from "mongoose";

export interface IComment extends Document {
  author: Schema.Types.ObjectId;
  blog: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const BlogSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Comment = models.Comment || model<IComment>("Comment", BlogSchema);

export default Comment;

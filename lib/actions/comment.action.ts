"use server";

import Blog from "@/database/blog.model";
import { connectToDatabase } from "../mongoose";
import {
  CommentVoteParams,
  CreateCommentParams,
  GetCommentsParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";
import Comment from "@/database/comment.model";

export async function createComment(params: CreateCommentParams) {
  try {
    connectToDatabase();

    const { content, author, blog, path } = params;

    const newComment = await Comment.create({
      content,
      author,
      blog,
    });

    // add the comment to the blogs's comments array
    const blogObject = await Blog.findByIdAndUpdate(blog, {
      $push: { comments: newComment._id },
    });

    await Interaction.create({
      user: author,
      action: "comment",
      blog,
      answer: newComment._id,
      tags: blogObject.tags,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getComments(params: GetCommentsParams) {
  try {
    connectToDatabase();

    const { blogId, sortBy, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const comments = await Comment.find({ blog: blogId })
      .populate("author", "_id clerkId name picture")
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalComments = await Comment.countDocuments({ blog: blogId });

    const isNextComment = totalComments > skipAmount + comments.length;

    return { comments, isNextComment };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteComment(params: CommentVoteParams) {
  try {
    connectToDatabase();

    const { commentId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const comment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
      new: true,
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Increment author reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(comment.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteComment(params: CommentVoteParams) {
  try {
    connectToDatabase();

    const { commentId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const comment = await Comment.findByIdAndUpdate(commentId, updateQuery, {
      new: true,
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Increment author reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(comment.author, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

"use server";

import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import {
  BlogVoteParams,
  CreateBlogParams,
  DeleteBlogParams,
  EditBlogParams,
  GetBlogByIdParams,
  GetBlogsParams,
} from "./shared.types";
import Blog from "@/database/blog.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";
import { revalidatePath } from "next/cache";

export async function getBlogs(params: GetBlogsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    // calculate the number of posts to skip based on the number and pagesize
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Blog> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.comments = { $size: 0 };
        break;
      default:
        break;
    }

    const blogs = await Blog.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalBlogs = await Blog.countDocuments(query);

    const isNext = totalBlogs > skipAmount + blogs.length;

    return { blogs, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createBlog(params: CreateBlogParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // create the question
    const blog = await Blog.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { blogs: blog._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Blog.findByIdAndUpdate(blog._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      action: "write-blog",
      question: blog._id,
      tags: tagDocuments,
    });

    // increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getBlogById(params: GetBlogByIdParams) {
  try {
    connectToDatabase();

    const { blogId } = params;

    const blog = await Blog.findById(blogId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return blog;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteBlog(params: BlogVoteParams) {
  try {
    connectToDatabase();

    const { blogId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const blog = await Blog.findByIdAndUpdate(blogId, updateQuery, {
      new: true,
    });

    if (!blog) {
      throw new Error("Question not found");
    }

    // Increment author reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(blog.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteBlog(params: BlogVoteParams) {
  try {
    connectToDatabase();

    const { blogId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const blog = await Blog.findByIdAndUpdate(blogId, updateQuery, {
      new: true,
    });

    if (!blog) {
      throw new Error("Question not found");
    }

    // Increment author reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(blog.author, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteBlog(params: DeleteBlogParams) {
  try {
    connectToDatabase();

    const { blogId, path } = params;

    await Blog.deleteOne({ _id: blogId });
    // await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ blog: blogId });
    await Tag.updateMany({ blogs: blogId }, { $pull: { blogs: blogId } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function EditBlog(params: EditBlogParams) {
  try {
    connectToDatabase();

    const { blogId, title, content, path } = params;

    const blog = await Blog.findById(blogId).populate("tags");

    if (!blog) {
      throw new Error("blog not found");
    }

    blog.title = title;
    blog.content = content;

    await blog.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

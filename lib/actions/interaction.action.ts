"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewBlogParams, ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import Blog from "@/database/blog.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, userId } = params;

    // update view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (existingInteraction) return console.log("user has already viewed.");
    }

    await Interaction.create({
      user: userId,
      action: "view",
      question: questionId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function viewBlog(params: ViewBlogParams) {
  try {
    connectToDatabase();

    const { blogId, userId } = params;

    // update view count for the blog
    await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        blog: blogId,
      });
      if (existingInteraction) return console.log("user has already viewed.");
    }

    await Interaction.create({
      user: userId,
      action: "view",
      blog: blogId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

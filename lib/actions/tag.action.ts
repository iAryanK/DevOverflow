"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function GetTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // find interaction for the user and group by tags
    const interactionAggregate = await Interaction.aggregate([
      { $match: { user: userId } }, // Match interactions of the user
      { $unwind: "$tags" }, // Unwind the tags array
      { $group: { _id: "$tags", count: { $sum: 1 } } }, // Group by tags and count interactions
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      }, // Lookup to fetch tag information
      { $unwind: "$tagInfo" }, // Unwind the tagInfo array
      { $addFields: { tagName: "$tagInfo.name" } }, // Add a new field for tag name
      { $project: { _id: 1, tagName: 1, count: 1 } }, // Project only tagName and count
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 3 }, // Limit the result to top three tags
    ]);

    // Map the result to get tag ids and tagName
    const topTags = interactionAggregate.map((tag) => ({
      _id: tag._id,
      tag: tag._id,
      name: tag.tagName,
    }));

    return topTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { questions: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 20, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    // .populate({
    //   path: "blogs",
    //   model: Blog,
    //   match: searchQuery
    //     ? { title: { $regex: searchQuery, $options: "i" } }
    //     : {},
    //   options: {
    //     sort: { createdAt: -1 },
    //     skip: skipAmount,
    //     limit: pageSize + 1,
    //   },
    //   populate: [
    //     { path: "tags", model: Tag, select: "_id name" },
    //     { path: "author", model: User, select: "_id clerkId name picture" },
    //   ],
    // });

    if (!tag) throw new Error("user not found");

    const isNext = tag.questions.length > pageSize;

    const questions = tag.questions;
    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

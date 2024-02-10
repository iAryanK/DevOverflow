import React from "react";
import { SearchParamsProps } from "@/types";
import { getUserBlogs } from "@/lib/actions/user.action";
import Pagination from "./Pagination";
import BlogCard from "../Cards/BlogCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const BlogTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserBlogs({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result.blogs.map((item) => (
        <BlogCard
          key={item._id}
          clerkId={clerkId}
          _id={item._id}
          title={item.title}
          views={item.views}
          comments={item.comments.length}
          tags={item.tags}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}

      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNextBlogs}
      />
    </>
  );
};

export default BlogTab;

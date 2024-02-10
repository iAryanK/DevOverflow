import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { BlogPageFilters } from "@/constants/filters";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import Pagination from "../../../components/shared/Pagination";
import { Metadata } from "next";
import { getBlogs } from "@/lib/actions/blog.action";
import BlogCard from "@/components/Cards/BlogCard";

export const metadata: Metadata = {
  title: "Blogs | DevCommunity",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  // const { userId } = auth();
  // let result;

  // if (searchParams?.filter === "recommended") {
  //   if (userId) {
  //     result = await getRecommendedQuestions({
  //       userId,
  //       searchQuery: searchParams.q,
  //       page: searchParams.page ? +searchParams.page : 1,
  //     });
  //   } else {
  //     result = {
  //       blogs: [],
  //       isNext: false,
  //     };
  //   }
  // } else {
  const result = await getBlogs({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  // }

  // fetch recommended

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Community Blogs</h1>

        <Link href="/write-blog" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Write a blog
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for articles"
          otherClasses="flex-1"
        />
        <Filter
          filters={BlogPageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.blogs.length > 0 ? (
          result.blogs.map((blog: any) => (
            <BlogCard
              key={blog._id}
              _id={blog._id}
              title={blog.title}
              tags={blog.tags}
              views={blog.views}
              upvotes={blog.upvotes.length}
              author={blog.author}
              comments={blog.comments}
              createdAt={blog.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no blogs to show"
            description="Be the first to break the silence! 🚀 Write an Article and spread your knowledge. Maybe next time when someone gets stuck writing a code, your blog can resolve their problem. Get involved! 💡"
            link="/write-blog"
            linkTitle="Write a blog"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}

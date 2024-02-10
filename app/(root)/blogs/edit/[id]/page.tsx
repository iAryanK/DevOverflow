import Blog from "@/components/Forms/Blog";
import { getBlogById } from "@/lib/actions/blog.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";
// import Page from "../../[id]/page";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  const result = await getBlogById({ blogId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit your Blog</h1>

      <div className="mt-9">
        <Blog
          type="Edit"
          mongoUserId={mongoUser._id}
          blogDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;

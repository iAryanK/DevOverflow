"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteBlog } from "@/lib/actions/blog.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    if (type === "Question")
      router.push(`/question/edit/${JSON.parse(itemId)}`);
    else if (type === "Blog") {
      router.push(`/blogs/edit/${JSON.parse(itemId)}`);
    }
  };

  const handleDelete = async () => {
    if (type === "Question") {
      // delete question
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else if (type === "Answer") {
      // delete answer
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    } else if (type === "Blog") {
      await deleteBlog({ blogId: JSON.parse(itemId), path: pathname });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {(type === "Question" || type === "Blog") && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;

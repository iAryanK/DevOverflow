"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { CommentSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { createComment } from "@/lib/actions/comment.action";

interface Props {
  blogId: string;
  authorId: string;
}

const Comment = ({ blogId, authorId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleCreateComment = async (values: z.infer<typeof CommentSchema>) => {
    setIsSubmitting(true);
    try {
      await createComment({
        content: values.comment,
        author: JSON.parse(authorId),
        blog: JSON.parse(blogId),
        path: pathname,
      });

      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800 mt-6">
          Write your comment here
        </h4>
      </div>

      <Form {...form}>
        <form
          className="mt-4 flex w-full flex-row items-start justify-center gap-10"
          onSubmit={form.handleSubmit(handleCreateComment)}
        >
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus text-dark400_light700  bg-transparent outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Comment;

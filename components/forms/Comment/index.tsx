'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/thread';
import Image from 'next/image';
import { createCommentThread } from '@/lib/actions/thread.actions';

type CommentFormProps = {
  parentThreadId: string;
  currentUserId: string;
  currentUserImage: string;
};

const CommentForm = ({
  parentThreadId,
  currentUserId,
  currentUserImage,
}: CommentFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const formData = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: '',
      accountId: currentUserId,
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    createCommentThread({
      commentText: values.comment,
      parentThreadId,
      pathname,
      userId: currentUserId,
    });

    formData.reset();
  };

  return (
    <Form {...formData}>
      <form onSubmit={formData.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={formData.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-3 w-full">
              <FormLabel className="relative h-11 w-11 flex-shrink-0">
                <Image
                  src={currentUserImage || '/'}
                  alt="comment-profile-img"
                  fill
                  className="cursor-pointer rounded-full"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  className="no-focus text-light-1 outline-none"
                  placeholder="Comment..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;

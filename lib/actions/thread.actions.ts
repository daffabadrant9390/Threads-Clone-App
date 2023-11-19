'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import User from '../models/user.model';

type CreateThreadParams = {
  text: string;
  author: string;
  communityId?: string | null;
  path: string;
};

type FetchThreadsParams = {
  pageNumber: number;
  pageSize: number;
};

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: CreateThreadParams) => {
  try {
    connectToDB();

    // Insert new data at Thread collection
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    if (!!createdThread) {
      // Update the threads data from User collection
      await User.findByIdAndUpdate(author, {
        $push: { threads: createdThread._id },
      });
    } else {
      console.error('Failed to create new thread');
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create new thread: ${error.message}`);
  }
};

export const fetchThreads = async ({
  pageNumber = 1,
  pageSize = 20,
}: FetchThreadsParams) => {
  try {
    connectToDB();

    // Calculate the number of threads to skip (if the user directly jump from page 1 to 3 or etc)
    const skipAmountThreads = (pageNumber - 1) * pageSize;

    /*
      [INFO]: Rules to fetch the threads data
        - Only fetch threads without parentId (top level threads)
        - fetch the threads which match with the requirements
        - Populate the author data from User model
        - Populate the children data from Thread model itself
    */
    const threadsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skipAmountThreads)
      .limit(pageSize)
      .populate({ path: 'author', model: User })
      .populate({
        path: 'childrenThreads',
        populate: {
          path: 'author',
          model: User,
          select: '_id name parentId image',
        },
      });

    // Execute the threadsQuery above to MongoDB
    const threadsDataPerPage = await threadsQuery.exec();

    // Get all the threads count on the database
    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    // Check if still have next page
    const isHavingNextPage =
      (totalThreadsCount || 0) >
      skipAmountThreads + (threadsDataPerPage.length || 0);

    return {
      threadsDataPerPage,
      isHavingNextPage,
    };
  } catch (error: any) {
    throw new Error(`Error fetch threads data: ${error.message}`);
  }
};

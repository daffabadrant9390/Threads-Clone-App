'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import Community from '../models/community.model';

// Threads
type CreateThreadParams = {
  text: string;
  author: string;
  communityId?: string | null;
  path: string;
};

type GetThreadsParams = {
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

    // Check if we found the community object from communityId
    const communityObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    // Insert new data at Thread collection
    const createdThread = await Thread.create({
      text,
      author,
      community: communityObject || null, // Assign communityId if provided, or leave it null for personal account
    });

    if (!!createdThread) {
      // Update the threads data from User collection
      await User.findByIdAndUpdate(author, {
        $push: { threads: createdThread._id },
      });

      // Also update the community by pushing the new thread to threads array
      if (!!communityObject) {
        await Community.findByIdAndUpdate(communityObject, {
          $push: { threads: createdThread._id },
        });
      }

      revalidatePath(path);
    } else {
      throw new Error('Failed to create new thread');
    }
  } catch (error: any) {
    throw new Error(`Failed to create new thread: ${error.message}`);
  }
};

export const getThreads = async ({
  pageNumber = 1,
  pageSize = 20,
}: GetThreadsParams) => {
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
        path: 'community',
        model: Community,
      })
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

export const getThreadById = async (threadId: string) => {
  try {
    connectToDB();

    const threadData = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      }) // Populate the author field with _id and username
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      }) // Populate the community field with _id and name
      .populate({
        path: 'childrenThreads',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentThreadId image',
          },
          {
            path: 'childrenThreads',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentThreadId image',
            },
          },
        ],
      })
      .exec();

    return threadData;
  } catch (error: any) {
    throw new Error(`Error fetch single thread by id: ${error.message}`);
  }
};

// Comments
type CreateCommentThreadParams = {
  parentThreadId: string;
  commentText: string;
  userId: string;
  pathname: string;
};

export const createCommentThread = async (
  params: CreateCommentThreadParams
) => {
  try {
    connectToDB();

    const { parentThreadId, commentText, userId, pathname } = params || {};

    // Get the original thread (parent thread) using parentThreadId
    const originalParentThread = await Thread.findById(parentThreadId);
    if (!originalParentThread) throw new Error('Thread not found!');

    // Create new Thread data with the comment data and save it to mongo database
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentThreadId: parentThreadId,
    });
    const savedCommentThread = await commentThread.save();

    // Update the childrenThreads inside originalParentThread using the new comment thread _id
    originalParentThread.childrenThreads.push(savedCommentThread._id);
    await originalParentThread.save();

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Error create comment thread: ${error.message}`);
  }
};

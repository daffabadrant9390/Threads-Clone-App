'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import { FilterQuery, SortOrder } from 'mongoose';

type UpdateUserDataParams = {
  userId: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  urlPath: string;
};

export const getUserData = async (userId: string) => {
  connectToDB();

  try {
    const userData = await User.findOne({
      id: userId || '',
    });

    if (!!userData) {
      return userData;
    } else {
      return console.log('User with ID not found on the database!');
    }
  } catch (error: any) {
    throw new Error(`Failed to get the user data: ${error.message}`);
  }
};

export const updateUserData = async (
  params: UpdateUserDataParams
): Promise<void> => {
  try {
    // Make sure we connect to the database
    connectToDB();

    await User.findOneAndUpdate(
      { id: params.userId },
      {
        name: params.name || '',
        username: (params.username || '').toLowerCase(),
        image: params.image || '',
        bio: params.bio || '',
        onboarded: true,
      },
      { upsert: true }
    );

    if (params.urlPath === '/profile/edit') revalidatePath(params.urlPath);
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
};

export const getThreadsByUserId = async (userId: string) => {
  try {
    connectToDB();

    const threadData = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: [
        {
          path: 'author',
          model: User,
        },
        {
          path: 'childrenThreads',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'id name image',
          },
        },
      ],
      options: {
        sort: {
          createdAt: 'desc',
        },
      },
    });

    return threadData;
  } catch (error: any) {
    throw new Error(`Error fetch thread data: ${error.message}`);
  }
};

type GetUsersDataByQueryParams = {
  userId: string;
  searchString: string;
  pageNumber: number;
  pageSize: number;
  sortBy?: SortOrder;
};

export const getUsersDataByQuery = async ({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: GetUsersDataByQueryParams) => {
  try {
    connectToDB();

    const skipUsersAmount = (pageNumber - 1) * pageSize;

    // Convert all the characters to be lowercase
    const regexSearchString = new RegExp(searchString, 'i');

    /*
      $ne in mongodb means "not-equal"
      - Search all the users inside User collection, except the user with the id same as userId
      - So that the current user which login cant search him/herself on the search
    */
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    /*
      - As long as the searchString is not null or empty string, match the searchString with 
        user's username or name from the collection 
    */
    if ((searchString || '').trim() !== '') {
      query.$or = [
        { username: { $regex: regexSearchString } },
        { name: { $regex: regexSearchString } },
      ];
    }

    const sortingOptions = { createdAt: sortBy };

    // Start the query from the real collection User
    const usersDataQuery = User.find(query)
      .sort(sortingOptions)
      .skip(skipUsersAmount)
      .limit(pageSize);

    // Get the length of User collection
    const totalUsersCollectionCount = await User.countDocuments(query);

    // Execute the query
    const usersData = await usersDataQuery.exec();

    const isNextPageAvailable =
      (totalUsersCollectionCount || 0) >
      skipUsersAmount + (usersData || []).length;

    return {
      users: usersData,
      isNextPageAvailable,
    };
  } catch (error: any) {
    throw new Error(`Failed fetch the users data by query: ${error.message}`);
  }
};

export const getUserActivities = async ({ userId }: { userId: string }) => {
  try {
    connectToDB();

    // Get all the threads from the current user which login
    const userThreads = await Thread.find({ author: userId });

    // From all the user's threads, collect all the childrenThreads (replies) from each of their thread
    const userChildrenThreads = (userThreads || []).reduce(
      (acc, currentUserThread) => {
        const { childrenThreads } = currentUserThread || {};
        console.log('current acc condition: ', acc);

        // Concat all the childrenThreads from each userThread into 1 array
        return acc.concat(childrenThreads);
      },
      []
    );

    /* 
      Get all the threads data from Thread collection which match:
        - the _id should be match with userChildrenThreads
        - the author should be not equal to userId, because we dont want to get the replies from the login user
    */
    const threadRepliesFromOtherUsers = await Thread.find({
      _id: { $in: userChildrenThreads },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: '_id name image',
    });

    return threadRepliesFromOtherUsers;
  } catch (error: any) {
    throw new Error(`Failed to fetch the thread replies: ${error.message}`);
  }
};

'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';

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

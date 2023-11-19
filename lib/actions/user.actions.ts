'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

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
  // Make sure we connect to the database
  connectToDB();

  try {
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
    console.log('Success update user data');

    if (params.urlPath === '/profile/edit') revalidatePath(params.urlPath);
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
};

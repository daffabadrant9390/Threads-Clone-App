'use server';

import { FilterQuery, SortOrder } from 'mongoose';
import Community from '../models/community.model';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

type CreateCommunityParams = {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  createdById: string;
};

export const createCommunity = async ({
  id,
  name,
  username,
  image,
  bio,
  createdById,
}: CreateCommunityParams) => {
  try {
    connectToDB();

    // Find the user data who created the community from User collection
    const user = await User.findOne({ id: createdById });

    if (!user) throw new Error('User who created community not found!');

    const newCommunity = new Community({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id, // Use the mongoose ID of the user
    });

    const createdCommunity = await newCommunity.save();

    // Update and Save the User model
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error: any) {
    throw new Error(`Error creating community: ${error.message}`);
  }
};

export const getCommunityDetailsById = async (communityId: string) => {
  try {
    connectToDB();

    const communityData = await Community.findOne({ id: communityId }).populate(
      {
        path: 'members',
        model: User,
        select: '_id id image name username',
      }
    );

    if (!communityData) throw new Error('Community is not found');

    return communityData;
  } catch (error: any) {
    throw new Error(`Error get community details: ${error.message}`);
  }
};

export const getCommunityThreadsAndPosts = async (communityId: string) => {
  try {
    connectToDB();

    const communityData = await Community.findOne({ id: communityId }).populate(
      {
        path: 'threads',
        model: Thread,
        populate: [
          {
            path: 'author',
            model: User,
            select: 'name image id _id',
          },
          {
            path: 'childrenThreads',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: 'image _id',
            },
          },
        ],
      }
    );

    if (!communityData) throw new Error('Community is not found');

    return communityData;
  } catch (error: any) {
    throw new Error(`Error get community details: ${error.message}`);
  }
};

type GetCommunitiesByQueryParams = {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
};

export const getCommunitiesByQuery = async ({
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: GetCommunitiesByQueryParams) => {
  try {
    connectToDB();

    //* Calculate the number of skipped communities based on the page number and size
    const skipCommunitiesAmount = (pageNumber - 1) * pageSize;

    //* Create a case-insensitive regex for the provided search setting
    const regexSearchString = new RegExp(searchString, 'i');

    //* Create initial query object to filter community
    const query: FilterQuery<typeof Community> = {};

    //* If the search string is not empty, fill the query with regex and $or to match either username or name field
    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regexSearchString } },
        { name: { $regex: regexSearchString } },
      ];
    }

    //* Define the sort options
    const sortOptions = { createdAt: sortBy };

    // Create the real query to fetch the communities data based on the specifications above
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipCommunitiesAmount)
      .limit(pageSize)
      .populate('members');

    // Calculate the number of data inside community collection
    const totalCommunitiesDataCount = await Community.countDocuments(query);

    // Execute the query above
    const communitiesDataByQuery = await communitiesQuery.exec();

    const isNextPageAvailable =
      totalCommunitiesDataCount >
      skipCommunitiesAmount + (communitiesDataByQuery || []).length;

    return {
      communities: communitiesDataByQuery,
      isNextPageAvailable,
    };
  } catch (error: any) {
    throw new Error(`Error get communities by query: ${error.message}`);
  }
};

export const addNewMemberToCommunity = async (
  communityId: string,
  memberId: string
) => {
  try {
    connectToDB();

    // Find the community using communityId
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error('Community not found!');
    }

    // Find the user using memberId
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error('User not found!');
    }

    // Check if the specific user already inside community member
    const communityMembers = community.members || [];
    if (communityMembers.includes(user._id)) {
      throw new Error('User is already a member of the community');
    }

    // Add the user _id inside community.members
    communityMembers.push(user._id);
    await community.save();

    // Add the community _id inside user.communities
    const userCommunities = user.communities || [];
    userCommunities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    // Handle any errors
    console.error('Error adding member to community:', error);
    throw error;
  }
};

export const removeUserFromCommunityMember = async (
  userId: string,
  communityId: string
) => {
  try {
    connectToDB();

    // Get the community from communityId
    const community = await Community.findOne({ id: communityId }, { _id: 1 });

    if (!community) {
      throw new Error('Community is not found');
    }

    const user = await User.findOne({ id: userId }, { _id: 1 });

    if (!user) {
      throw new Error('User is not found!');
    }

    const communityMembers = community.members || [];
    // Validate if the user is already part of community member
    if (!communityMembers.includes(user._id)) {
      throw new Error('User is not part of this community members');
    }

    // Remove the user's _id from the community members array
    await Community.updateOne(
      { _id: community._id },
      { $pull: { members: user._id } }
    );

    // Remove the community's _id from the communities array inside user object
    await User.updateOne(
      { _id: user._id },
      { $pull: { communities: community._id } }
    );

    return {
      status: 'SUCCESS',
    };
  } catch (error) {
    // Handle any errors
    console.error('Error removing user from community:', error);
    throw error;
  }
};

export const updateCommunityInfo = async ({
  communityId,
  name,
  username,
  image,
}: {
  communityId: string;
  name: string;
  username: string;
  image: string;
}) => {
  try {
    connectToDB();

    // Find the community by its id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error('Community is not found!');
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error('Error updating community information:', error);
    throw error;
  }
};

export const deleteCommunity = async (communityId: string) => {
  try {
    connectToDB();

    // Find the community object using communityId and remove it from database
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error('Community is not found!');
    }

    // Delete all the threads associated with the community
    await Thread.deleteMany({ community: communityId });

    // Delete the specific community from each user's communities whom already part of the members
    // Find all the user whom part of community's members
    const communityMembers = await User.find({ communities: communityId });

    // Remove the community from each user's communities
    const updatedUserCommunitiesPromises = (communityMembers || []).map(
      (user) => {
        user.communities.pull(communityId);
        return user.save();
      }
    );

    await Promise.all(updatedUserCommunitiesPromises);

    return deletedCommunity;
  } catch (error) {
    console.error('Error deleting community: ', error);
    throw error;
  }
};

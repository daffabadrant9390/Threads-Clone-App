'use client';

import React, { ChangeEvent, useState } from 'react';
import { UserData } from '@/types/userDataTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUserData } from '@/lib/actions/user.actions';
import { useRouter, usePathname } from 'next/navigation';

type AccountProfileProps = {
  userData: UserData;
  btnTitle: String;
};

const AccountProfile = ({ userData, btnTitle }: AccountProfileProps) => {
  const [imageFile, setImageFile] = useState<File[]>([]);
  const { startUpload } = useUploadThing('media');

  const router = useRouter();
  const pathName = usePathname();

  const {
    image: userDataImage,
    name: userDataName,
    username: userDataUsername,
    bio: userDataBio,
  } = userData || {};

  const formData = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: userDataImage,
      name: userDataName,
      username: userDataUsername,
      bio: userDataBio,
    },
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    console.log('values: ', values);
    const blob = values.profile_photo;

    // Check whether the image already changed or not
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(imageFile);
      const firstImgResFileUrl = imgRes?.[0].url || '';

      if (!!imgRes && !!firstImgResFileUrl) {
        // Update the value of profile_photo with the new url from imgRes
        values.profile_photo = firstImgResFileUrl;
      }
    }

    await updateUserData({
      userId: userData.id,
      name: values.name,
      username: values.username,
      bio: values.bio,
      image: values.profile_photo,
      urlPath: pathName,
    });

    if (pathName === 'profile/edit') {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleUpdateProfileImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    // Prevent the browser to reload the page
    e.preventDefault();

    // Initialize the file reader
    const fileReader = new FileReader();
    const filesTargetEvent = e.target.files;

    if (!!filesTargetEvent && !!filesTargetEvent.length) {
      const firstFileTargetEvent = filesTargetEvent[0];
      setImageFile(Array.from(filesTargetEvent));

      if (!(firstFileTargetEvent.type || '').includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(firstFileTargetEvent);
    }
  };

  return (
    <Form {...formData}>
      <form
        onSubmit={formData.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        {/* Profile Photo */}
        <FormField
          control={formData.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4">
              <FormLabel className="account-form_image-label relative">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="Profile Photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="Profile Photo"
                    width={24}
                    height={24}
                    priority
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleUpdateProfileImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Name */}
        <FormField
          control={formData.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Username */}
        <FormField
          control={formData.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Bio */}
        <FormField
          control={formData.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;

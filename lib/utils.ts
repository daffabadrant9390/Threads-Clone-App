import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBase64Image = (imageData: string) => {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
};

export const formatDateString = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);
  const formattedTime = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${formattedTime} - ${formattedDate}`;
};

export const formatThreadCount = (count: number): string => {
  if (count === 0) return 'No Threads';

  const threadCount = count.toString().padStart(2, '0');
  const threadWord = count > 1 ? 'Threads' : 'Thread';
  return `${threadCount} ${threadWord}`;
};

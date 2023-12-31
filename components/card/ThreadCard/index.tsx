import { formatDateString } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export type CommonAuthorItem = {
  id: string;
  name: string;
  image: string;
};

type ThreadCardProps = {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: CommonAuthorItem;
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: CommonAuthorItem;
  }[];
  isComment?: boolean;
};

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: ThreadCardProps) => {
  return (
    <article
      className={`w-full flex flex-col rounded-xl ${
        isComment ? 'px-0 xs:px-7 pb-7' : 'bg-dark-2 p-7'
      }`}
    >
      {/* Flex Container Card */}
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          {/* Left section: Author Image */}
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>

          {/* Right section: Author Name, Thread Content, Thread Actions, Replies */}
          <div className="w-full flex flex-col">
            {/* Author Name */}
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            {/* Thread Content */}
            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            {/* Thread Actions and Number of Replies */}
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex flex-row gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart-icon"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply-icon"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="repost-icon"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share-icon"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>

              {!!isComment ||
                (!!(comments || []).length && (
                  <Link href={`/thread/${id}`}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                      {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* TODO: Delete Thread */}
      </div>
      {/* TODO: Comments image and replies text */}

      {!isComment && !!community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1 hover:text-light-2 transition duration-300 ease-in-out">
            {`${formatDateString(createdAt)} - ${
              community.name || ''
            } Community`}
          </p>
          <div className="ml-2 relative w-5 h-5 flex-shrink-0">
            <Image
              src={community.image || '/'}
              alt={community.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;

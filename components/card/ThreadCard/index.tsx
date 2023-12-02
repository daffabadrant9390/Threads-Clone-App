import Image from 'next/image';
import Link from 'next/link';

type ThreadCardProps = {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  isCommented?: boolean;
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
  isCommented,
}: ThreadCardProps) => {
  return (
    <article className="w-full flex flex-col rounded-xl bg-dark-2 p-7">
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

              {!!isCommented && !!(comments || []).length && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;

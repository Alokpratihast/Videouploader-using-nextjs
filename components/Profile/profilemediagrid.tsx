"use client";
import Image from "next/image";

interface MediaItem {
  _id: string;
  url: string;
  fileType: string;
  likes?: string[];
  uploadedBy: string;
}

interface Props {
  mediaList: MediaItem[];
  userId: string;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (media: MediaItem) => void;
}

export default function UserMediaGrid({
  mediaList,
  userId,
  onLike,
  onDelete,
  onPreview,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {mediaList.map((media) => {
        const isLiked = media.likes?.includes(userId);
        const isOwner = media.uploadedBy === userId;

        return (
          <div
            key={media._id}
            className="group aspect-square bg-white dark:bg-neutral-800 rounded-md shadow overflow-hidden relative"
          >
            {media.fileType.startsWith("image") ? (
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={() => onPreview(media)}
              >
                <Image
                  src={media.url}
                  alt="media"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : (
              <video
                className="w-full h-full object-cover cursor-pointer"
                muted
                loop
                playsInline
                onClick={() => onPreview(media)}
              >
                <source src={media.url} type="video/mp4" />
              </video>
            )}

            {/* Like Button */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <button
                onClick={() => onLike(media._id)}
                className="bg-white/80 dark:bg-black/60 backdrop-blur-sm p-1 rounded-full text-lg hover:bg-pink-200"
              >
                {isLiked ? "❤️" : "🤍"}
              </button>
              <span className="text-white font-medium drop-shadow">
                {media.likes?.length ?? 0}
              </span>
            </div>

            {/* Delete Button */}
            {isOwner && (
              <button
                onClick={() => onDelete(media._id)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded shadow-md"
              >
                Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

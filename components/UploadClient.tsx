"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import MediaPreviewModal from "@/components/UI/MediaPreviewModal";

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  fileType: string;
  createdAt: string;
  likes?: string[];
  uploadedBy: string;
}

export default function GalleryClient() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch("/api/save-media");
        const data = await res.json();
        if (Array.isArray(data)) {
          setMediaList(data);
        } else {
          setMediaList([]);
        }
      } catch (error:unknown) {
        toast.error("❌ Failed to fetch media");
        setMediaList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleLike = async (mediaId: string) => {
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
      });

      if (res.ok) {
        const result = await res.json();
        setMediaList((prev) =>
          prev.map((media) =>
            media._id === mediaId
              ? {
                  ...media,
                  likes: result.liked
                    ? [...(media.likes ?? []), userId!]
                    : (media.likes ?? []).filter((id) => id !== userId),
                }
              : media
          )
        );
      }
    } catch {
      toast.error("❌ Failed to like media");
    }
  };

  const handleDelete = async (mediaId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this media?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/delete-media?id=${mediaId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMediaList((prev) => prev.filter((media) => media._id !== mediaId));
        toast.success("✅ Deleted successfully");
      } else {
        toast.error("❌ Delete failed");
      }
    } catch {
      toast.error("❌ Error deleting media");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📸 Your Media Gallery
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading media...</p>
      ) : mediaList.length === 0 ? (
        <p className="text-center text-gray-500">No media uploaded yet.</p>
      ) : (
        <div className="grid gap-1 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
          {mediaList.map((media) => {
            const isLiked = media.likes?.includes(userId ?? "") ?? false;
            const isOwner = media.uploadedBy === userId;

            return (
              <div
                key={media._id}
                className="relative group aspect-square overflow-hidden bg-white border border-gray-200"
              >
                {media.fileType.startsWith("image") ? (
                  <Image
                    src={media.url}
                    alt={media.name || "media"}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setSelectedMedia(media)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <video
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedMedia(media)}
                    muted
                    loop
                    playsInline
                  >
                    <source src={media.url} type="video/mp4" />
                  </video>
                )}

                {/* Like + Count */}
                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                  <button
                    onClick={() => handleLike(media._id)}
                    className="bg-white/80 p-1 rounded-full text-lg hover:bg-pink-200"
                  >
                    {isLiked ? "❤️" : "🤍"}
                  </button>
                  <span className="text-white font-medium drop-shadow">
                    {media.likes?.length ?? 0}
                  </span>
                </div>

                {/* Delete */}
                {isOwner && (
                  <button
                    onClick={() => handleDelete(media._id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded shadow-md"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Preview */}
      {selectedMedia && (
        <MediaPreviewModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}

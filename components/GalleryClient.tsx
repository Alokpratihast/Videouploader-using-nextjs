"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import DashboardCard from "./UI/DashboardCard";
import MediaCard from "./UI/MediaCard";
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
  const { data: session, status } = useSession();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id || "";

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch("/api/save-media");
        const data = await res.json();
        if (Array.isArray(data)) setMediaList(data);
      } catch (err:unknown) {
        toast.error("Failed to load media.");
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

      if (!res.ok) throw new Error();

      const result = await res.json();
      setMediaList((prev) =>
        prev.map((media) =>
          media._id === mediaId
            ? {
                ...media,
                likes: result.liked
                  ? [...(media.likes ?? []), userId]
                  : (media.likes ?? []).filter((id) => id !== userId),
              }
            : media
        )
      );
    } catch {
      toast.error("Like failed.");
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      const res = await fetch(`/api/delete-media?id=${mediaId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("✅ Deleted successfully");
      setMediaList((prev) => prev.filter((media) => media._id !== mediaId));
    } catch (err:unknown) {
      toast.error("❌ Delete failed.");
    }
  };

  if (status === "loading" || !session) {
    return <p className="text-center text-gray-500">Loading session...</p>;
  }

  return (
    <div className="p-4 md:p-8">
      <DashboardCard user={session.user.name || "User"} />

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        🎞️ Your Media Gallery
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading media...</p>
      ) : mediaList.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
          {mediaList.map((media) => (
            <MediaCard
              key={media._id}
              media={media}
              currentUserId={userId}
              onLike={handleLike}
              onDelete={handleDelete}
              onPreview={setSelectedMedia}
            />
          ))}
        </div>
      )}

      {selectedMedia && (
        <MediaPreviewModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}

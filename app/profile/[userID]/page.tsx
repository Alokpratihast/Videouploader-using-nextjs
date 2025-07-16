"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import ProfileHeader from "@/components/Profile/profileheader";
import UserMediaGrid from "@/components/Profile/profilemediagrid";
import MediaPreviewModal from "@/components/UI/MediaPreviewModal";
import { toast } from "sonner";

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  fileType: string;
  likes?: string[];
  uploadedBy: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchUserMedia = async () => {
      try {
        const res = await fetch(`/api/save-media/${id}`);
        const data = await res.json();
        if (Array.isArray(data)) setMediaList(data);
      } catch (err:anyway) {
        toast.error("❌ Failed to load user media.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserMedia();
  }, [id]);

  const handleLike = async (mediaId: string) => {
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
      });

      const result = await res.json();
      if (res.ok) {
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
      toast.error("❌ Like action failed.");
    }
  };

  const handleDelete = async (mediaId: string) => {
    try {
      const res = await fetch(`/api/delete-media?id=${mediaId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m._id !== mediaId));
        toast.success("✅ Media deleted.");
      } else {
        toast.error("❌ Delete failed.");
      }
    } catch {
      toast.error("❌ An error occurred.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <ProfileHeader
        coverUrl="https://ik.imagekit.io/your_cover_url"
        avatarUrl="https://ik.imagekit.io/your_avatar_url"
        name={session?.user?.name || "User"}
        email={session?.user?.email || "email@example.com"}
        bio="This is a sample user bio."
      />

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">Loading user media...</p>
      ) : mediaList.length === 0 ? (
        <p className="text-center text-gray-500">No media uploaded by this user.</p>
      ) : (
        <UserMediaGrid
          mediaList={mediaList}
          userId={userId!}
          onLike={handleLike}
          onDelete={handleDelete}
          onPreview={setSelectedMedia}
        />
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

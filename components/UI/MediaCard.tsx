"use client";

import Image from "next/image";

import "@/components/UI/MediaCard.css"

interface Props {
  media: {
    _id: string;
    url: string;
    name?: string;
    fileType: string;
    likes?: string[];
    uploadedBy: string;
  };
  currentUserId: string;
  onLike: (id: string) => void;
  onDelete?: (id: string) => void;
  onPreview?: (media: Props["media"]) => void;
}

export default function MediaCard({
  media,
  currentUserId,
  onLike,
  onDelete,
  onPreview,
}: Props) {
  const isLiked = media.likes?.includes(currentUserId) ?? false;
  const isOwner = media.uploadedBy === String(currentUserId);

  return (
    <div className="media-card">
      {media.fileType.startsWith("image") ? (
        <div onClick={() => onPreview?.(media)} style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={media.url}
            alt={media.name || "media"}
            fill
            className="media-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <video
          className="media-video"
          onClick={() => onPreview?.(media)}
          muted
          loop
          playsInline
        >
          <source src={media.url} type="video/mp4" />
        </video>
      )}

      {/* ❤️ Like button */}
      <div className="media-actions">
        <button type="button" onClick={() => onLike(media._id)}>
          {isLiked ? "❤️" : "🤍"}
        </button>
        <span className="like-count">{media.likes?.length ?? 0}</span>
      </div>

      {/* 🗑️ Delete button */}
      {isOwner && onDelete && (
        <button
          type="button"
          onClick={() => onDelete(media._id)}
          className="media-delete-btn"
        >
          Delete
        </button>
      )}
    </div>
  );
}

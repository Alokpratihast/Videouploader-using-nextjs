"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

interface Props {
  media: {
    url: string;
    name?: string;
    fileType: string;
  };
  onClose: () => void;
}

export default function MediaPreviewModal({ media, onClose }: Props) {
  // Escape key close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <button
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
            onClick={onClose}
          >
            ✖ Close
          </button>

          {media.fileType.startsWith("image") ? (
            <div className="relative w-full h-[85vh]">
              <Image
                src={`${media.url}?tr=w-800`}
                alt={media.name || "Preview"}
                width={800}
                height={600}
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <video controls autoPlay className="w-full max-h-[85vh] bg-black">
              <source src={media.url} type="video/mp4" />
            </video>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { PublicGalleryItem } from "../../types/gallery.public";

interface GalleryItemProps {
  image: PublicGalleryItem;
  index: number;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image, index, onClick }) => {
  const { t } = useTranslation("gallery");
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.3), // Stagger effect for initial load
      }}
      className="break-inside-avoid mb-6" // Crucial for CSS Masonry columns
      onClick={onClick}
    >
      <div className="group relative overflow-hidden rounded-2xl bg-stone-200 border border-stone-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-amber-200/50">
        {/* Blur-up Loading Placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
            <span className="text-stone-400 text-xs font-serif italic">
              {t("title")}
            </span>
          </div>
        )}

        <img
          src={image.imageUrl}
          alt={image.caption}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-lg"
          }`}
          loading="lazy"
        />

        {/* Year Badge (Always Visible - Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-bold rounded-lg shadow-sm border border-stone-100">
            {image.year}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            className="transform transition-transform"
          >
            <p className="text-white text-sm font-semibold leading-snug">
              {image.caption || t("no_caption")}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-4 h-px bg-amber-400" />
              <p className="text-amber-400 text-[10px] uppercase tracking-wider font-bold">
                {image.album}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryItem;

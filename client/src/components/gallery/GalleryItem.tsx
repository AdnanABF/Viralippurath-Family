import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import type { PublicGalleryItem } from "../../types/gallery.public";

interface GalleryItemProps {
  image: PublicGalleryItem;
  index: number;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image, index, onClick }) => {
  const { t } = useTranslation("gallery");
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Cloudinary Optimization Helper
   */
  const getOptimizedUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    return url.replace(
      "/upload/",
      "/upload/w_600,c_fill,g_auto,f_auto,q_auto/",
    );
  };

  /**
   * Force Download URL Helper
   */
  const getDownloadUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/fl_attachment/");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.3),
      }}
      className="break-inside-avoid mb-6"
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
          src={getOptimizedUrl(image.imageUrl)}
          alt={image.caption}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-lg"
          }`}
          loading="lazy"
        />

        {/* Year Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-bold rounded-lg shadow-sm border border-stone-100">
            {image.year}
          </span>
        </div>

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-5"
        >
          {/* Download Button - positioned at the top-right */}
          <div className="flex justify-start">
            {" "}
            {/* Use flexbox to push to end */}
            <a
              href={getDownloadUrl(image.imageUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Prevents opening the Lightbox
              className="p-2 bg-white/10 hover:bg-amber-500 backdrop-blur-md text-white hover:text-stone-900 rounded-xl transition-all duration-300 border border-white/10"
              title={t("download")}
            >
              <Download size={16} />
            </a>
          </div>

          {/* Image Details - positioned at the bottom */}
          <div>
            <p className="text-white text-sm font-semibold leading-snug">
              {image.caption || t("no_caption")}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-4 h-px bg-amber-400" />
              <p className="text-amber-400 text-[10px] uppercase tracking-wider font-bold">
                {image.album}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GalleryItem;

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, Image as ImageIcon, Download } from "lucide-react";
import type { PublicGalleryItem } from "../../types/gallery.public";

interface LightboxProps {
  image: PublicGalleryItem | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  const { t } = useTranslation("gallery");

  if (!image) return null;

  /**
   * Optimized View URL for Lightbox
   */
  const getFullResUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_1280,c_limit,f_auto,q_auto:eco/");
  };

  /**
   * Force Download URL
   * fl_attachment ensures the browser downloads the "raw" original file
   */
  const getDownloadUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/fl_attachment/");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-stone-950/95 backdrop-blur-sm p-4 md:p-10"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full z-110"
        >
          <X size={28} />
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-5xl w-full max-h-[85vh] grid grid-cols-1 lg:grid-cols-12 bg-stone-900 rounded-3xl overflow-x-hidden overflow-y-scroll shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Section */}
          <div className="lg:col-span-8 bg-black flex items-center justify-center min-h-75 md:min-h-125 overflow-hidden">
            <img
              src={getFullResUrl(image.imageUrl)}
              alt={image.caption}
              className="max-h-[80vh] w-full object-contain"
              loading="eager" // Load immediately in Lightbox
            />
          </div>

          {/* Details Section */}
          <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-stone-900 border-t lg:border-t-0 lg:border-l border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <ImageIcon className="text-amber-500" size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">
                  {t("image_details")}
                </span>
              </div>

              <h3 className="text-xl font-serif text-stone-100 leading-snug mb-4">
                {image.caption || t("no_caption")}
              </h3>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-stone-400">
                  <Calendar size={16} className="text-amber-500/60" />
                  <span className="text-sm font-medium">{image.year}</span>
                </div>
                <div className="flex items-center gap-3 text-stone-400">
                  <Tag size={16} className="text-amber-500/60" />
                  <span className="text-sm font-medium">{image.album}</span>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="mt-8 space-y-4">
              <a
                href={getDownloadUrl(image.imageUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-all duration-300 group"
              >
                <Download
                  size={20}
                  className="group-hover:translate-y-0.5 transition-transform"
                />
                {t("download", "Download Original")}
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;

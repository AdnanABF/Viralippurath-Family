import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, Image as ImageIcon } from "lucide-react";
import type { PublicGalleryItem } from "../../types/gallery.public";

interface LightboxProps {
  image: PublicGalleryItem | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  if (!image) return null;

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
          className="relative max-w-5xl w-full max-h-[80vh] grid grid-cols-1 lg:grid-cols-12 bg-stone-900 rounded-3xl overflow-x-hidden overflow-y-scroll shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
        >
          {/* Image Section */}
          <div className="lg:col-span-8 bg-black flex items-center justify-center min-h-75 md:min-h-125">
            <img
              src={image.imageUrl}
              alt={image.caption}
              className="max-h-[80vh] w-full object-contain"
            />
          </div>

          {/* Details Section */}
          <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-stone-900">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <ImageIcon className="text-amber-500" size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">
                  Image Details
                </span>
              </div>

              <h3 className="text-xl font-serif text-stone-100 leading-snug mb-4">
                {image.caption || "Untitled Memory"}
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;

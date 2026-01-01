import type { PublicGalleryItem } from "../../types/gallery.public";

interface Props {
  images: PublicGalleryItem[];
  loading: boolean;
}
const GalleryGrid: React.FC<Props> = ({ images, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-stone-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((img) => (
        <div
          key={img.id}
          className="group relative overflow-hidden rounded-xl bg-white border border-stone-200 shadow-sm cursor-pointer"
        >
          <img
            src={img.imageUrl}
            alt={img.caption}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <p className="text-white text-sm font-medium">{img.caption}</p>
            <p className="text-white/70 text-xs mt-1">
              {img.year} • {img.album}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;

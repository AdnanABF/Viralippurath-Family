import { useState } from "react";
import GalleryHeader from "../../components/gallery/GalleryHeader";
import GalleryFilters from "../../components/gallery/GalleryFilters";
import GalleryGrid from "../../components/gallery/GalleryGrid";
import { galleryImages } from "../../components/gallery/gallery.mock";

const Gallery = () => {
  const [activeAlbum, setActiveAlbum] = useState("All");

  const albums = [
    "All",
    ...Array.from(new Set(galleryImages.map((img) => img.album))),
  ];

  const filteredImages =
    activeAlbum === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.album === activeAlbum);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryHeader />
        <GalleryFilters
          albums={albums}
          activeAlbum={activeAlbum}
          onChange={setActiveAlbum}
        />
        <GalleryGrid images={filteredImages} loading={false} />
      </div>
    </div>
  );
};

export default Gallery;

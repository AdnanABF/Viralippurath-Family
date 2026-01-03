import { useEffect, useState } from "react";
import api from "../../services/api";
import GalleryHeader from "../../components/gallery/GalleryHeader";
import GalleryFilters from "../../components/gallery/GalleryFilters";
import GalleryGrid from "../../components/gallery/GalleryGrid";
import type { PublicGalleryItem } from "../../types/gallery.public";

const Gallery = () => {
  const [images, setImages] = useState<PublicGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [activeAlbum, setActiveAlbum] = useState("All");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await api.get<PublicGalleryItem[]>(
          "/gallery/published"
        );
        setImages(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const albums = [
    "All",
    ...Array.from(new Set(images.map((img) => img.album))),
  ].sort();

  const filteredImages =
    activeAlbum === "All"
      ? images
      : images.filter((img) => img.album === activeAlbum);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryHeader />
        {error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
            <h3 className="text-stone-800 font-serif text-xl mb-2">
              Unable to load gallery
            </h3>
            <p className="text-stone-500">
              Please check back later to see our family memories.
            </p>
          </div>
        ) : (
          <>
            <GalleryFilters
              albums={albums}
              activeAlbum={activeAlbum}
              onChange={setActiveAlbum}
            />

            {filteredImages.length === 0 && !loading ? (
              <div className="text-center py-20">
                <p className="text-stone-500 italic">
                  No images found in this album.
                </p>
              </div>
            ) : (
              <GalleryGrid images={filteredImages} loading={loading} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;

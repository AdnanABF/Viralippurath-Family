import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "../../services/public.service";
import GalleryHeader from "../../components/gallery/GalleryHeader";
import GalleryFilters from "../../components/gallery/GalleryFilters";
import GalleryGrid from "../../components/gallery/GalleryGrid";
import { AdminError } from "../../components/ui";
import type { PublicGalleryItem } from "../../types/gallery.public";
import { useTranslation } from "react-i18next";

const Gallery = () => {
  const { t } = useTranslation("gallery");
  const [activeAlbum, setActiveAlbum] = useState("All");

  // 1. Fetch Gallery Data
  const {
    data: images = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PublicGalleryItem[]>({
    queryKey: ["public-gallery"],
    queryFn: publicService.getGallery,
  });

  // 2. Memoize album list to prevent unnecessary recalculations
  const albums = useMemo<string[]>(() => {
    const list = [
      "All",
      ...Array.from(new Set(images.map((img: PublicGalleryItem) => img.album))),
    ].sort();
    return list;
  }, [images]);

  // 3. Filter images based on selected album
  const filteredImages = useMemo<PublicGalleryItem[]>(() => {
    return activeAlbum === "All"
      ? images
      : images.filter((img: PublicGalleryItem) => img.album === activeAlbum);
  }, [activeAlbum, images]);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryHeader />

        {isError ? (
          <AdminError
            title={t("error_title")}
            message={t("error_message")}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <GalleryFilters
              albums={albums}
              activeAlbum={activeAlbum}
              onChange={setActiveAlbum}
            />

            {filteredImages.length === 0 && !isLoading ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
                <p className="text-stone-500 italic">{t("no_image_message")}</p>
              </div>
            ) : (
              <GalleryGrid images={filteredImages} loading={isLoading} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;

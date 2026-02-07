import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "../../services/public.service";
import GalleryHeader from "../../components/gallery/GalleryHeader";
import GalleryGrid from "../../components/gallery/GalleryGrid";
import {
  AdminError,
  FilterPills,
  type FilterOption,
} from "../../components/ui";
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

  // 2. Generate Album Options with Counts
  const albumOptions = useMemo<FilterOption<string>[]>(() => {
    const counts: Record<string, number> = {};
    images.forEach((img) => {
      counts[img.album] = (counts[img.album] || 0) + 1;
    });

    const uniqueAlbums = Array.from(
      new Set(images.map((img) => img.album)),
    ).sort();

    return [
      { id: "All", label: t("filter_all", "All"), count: images.length },
      ...uniqueAlbums.map((album) => ({
        id: album,
        label: album,
        count: counts[album],
      })),
    ];
  }, [images, t]);

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
            {/* Reusable Filter Pills replacement for GalleryFilters */}
            <FilterPills
              options={albumOptions}
              activeId={activeAlbum}
              onSelect={setActiveAlbum}
              className="mb-12"
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

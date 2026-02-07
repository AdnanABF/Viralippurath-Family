import { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { publicService } from "../../services/public.service";
import GalleryHeader from "../../components/gallery/GalleryHeader";
import GalleryItem from "../../components/gallery/GalleryItem";
import {
  AdminError,
  AdminLoading,
  FilterPills,
  type FilterOption,
} from "../../components/ui";
import type { PublicGalleryItem } from "../../types/gallery.public";
import Lightbox from "../../components/gallery/Lightbox";

const Gallery = () => {
  const { t } = useTranslation("gallery");
  const [activeAlbum, setActiveAlbum] = useState("ALL");
  const [selectedImage, setSelectedImage] = useState<PublicGalleryItem | null>(
    null,
  );

  const { ref, inView } = useInView({ threshold: 0.1 });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["public-gallery", activeAlbum],
    queryFn: ({ pageParam = 1 }) =>
      publicService.getGallery({
        album: activeAlbum,
        page: pageParam,
        limit: 12,
      }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 1. Flatten and Group images by year for the timeline
  const groupedImages = useMemo(() => {
    const allImages = data?.pages.flatMap((page) => page.data) || [];
    const groups: Record<number, PublicGalleryItem[]> = {};

    allImages.forEach((image) => {
      if (!groups[image.year]) {
        groups[image.year] = [];
      }
      groups[image.year].push(image);
    });

    // Sort years descending
    return Object.entries(groups)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .map(([year, items]) => ({
        year: Number(year),
        items,
      }));
  }, [data]);

  const albumOptions = useMemo<FilterOption<string>[]>(() => {
    const meta = data?.pages[0]?.meta;
    const albumCounts = meta?.albumCounts || {};
    const uniqueAlbums = Object.keys(albumCounts).sort();

    return [
      {
        id: "ALL",
        label: t("filter_all", "All"),
        count: meta?.totalInView || 0,
      },
      ...uniqueAlbums.map((album) => ({
        id: album,
        label: album,
        count: albumCounts[album],
      })),
    ];
  }, [data, t]);

  return (
    <div className="py-15 sm:py-20 bg-stone-50 min-h-screen">
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
            <div className="sticky top-20 z-30">
              <FilterPills
                options={albumOptions}
                activeId={activeAlbum}
                onSelect={(id) => setActiveAlbum(id)}
                className="bg-stone-50/80"
                showNavButtons={true}
              />
            </div>

            {isLoading ? (
              <AdminLoading message={t("loading_gallery")} />
            ) : groupedImages.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 border-dashed">
                <p className="text-stone-400 font-medium">
                  {t("no_image_message")}
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-16">
                {groupedImages.map((group) => (
                  <section key={group.year} className="relative">
                    {/* Sticky Year Header */}
                    <div className="sticky top-40 z-20 mb-8">
                      <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-2 rounded-2xl shadow-sm border border-stone-100">
                        <span className="text-2xl font-serif font-bold text-stone-800">
                          {group.year}
                        </span>
                        <div className="h-4 w-px bg-stone-200" />
                        <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">
                          {group.items.length} {t("photos")}
                        </span>
                      </div>
                    </div>

                    {/* Masonry Grid for this specific year */}
                    <motion.div
                      layout
                      className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                    >
                      <AnimatePresence mode="popLayout">
                        {group.items.map((image, index) => (
                          <GalleryItem
                            key={image.uuid}
                            image={image}
                            index={index}
                            onClick={() => setSelectedImage(image)}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </section>
                ))}

                {/* Infinite Scroll Trigger Area */}
                <div ref={ref} className="py-20 flex justify-center">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-3 text-stone-400 animate-pulse">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                      <span className="text-sm font-medium italic">
                        {t("loading_more", "Uncovering more memories...")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default Gallery;

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import img1 from "../../assets/about/img1.webp";
import img2 from "../../assets/about/img2.webp";
import img3 from "../../assets/about/img3.webp";
import img4 from "../../assets/about/img4.webp";
import img5 from "../../assets/about/img5.webp";

const images = [img1, img2, img3, img4, img5];

const AboutImage = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  return (
    <div className="relative">
      {/* Carousel */}
      <div
        className="overflow-hidden rounded-2xl shadow-2xl relative z-10 aspect-4/5"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {" "}
          {images.map((src, index) => (
            <div className="flex-[0_0_100%] h-full" key={index}>
              {" "}
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                className={`w-full h-full object-cover ${
                  index === selectedIndex ? "animate-pan" : ""
                }`}
              />
            </div>
          ))}
        </div>

        {/* Premium Overlay Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? "w-6 h-2 bg-amber-600"
                    : "w-2 h-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute -top-4 -left-4 w-full h-full border-2 border-amber-700 rounded-2xl z-0" />
    </div>
  );
};

export default AboutImage;

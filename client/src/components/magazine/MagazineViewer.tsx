import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Loader2,
  BookOpen,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import type { PublicMagazine } from "../../types/magazine.public";

// Import the worker from the local node_modules
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// Set the worker source using the local URL
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// IMPORTANT: Add the standard CSS for react-pdf to prevent layout shifting
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../../utils/lang.utils";

interface Props {
  issue: PublicMagazine | null;
}

const MagazineViewer: React.FC<Props> = ({ issue }) => {
  const { t, i18n } = useTranslation("magazine");

  const [viewMode, setViewMode] = useState<"preview" | "reader">("preview");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState<number>(1.0);

  if (!issue) {
    return (
      <div className="aspect-3/4 sm:aspect-video bg-stone-100 rounded-2xl animate-pulse" />
    );
  }

  const thumbnail = issue.pdfUrl?.replace(/\.pdf$/, ".jpg");

  const displayDate = new Date(issue.publishedDate).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const displayTitle = getLocalized(issue, "title", i18n.language);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoaded(true);
  };

  // Reset reader when exiting
  const closeReader = () => {
    setViewMode("preview");
    setIsLoaded(false);
    setPageNumber(1);
    setScale(1.0);
  };

  const handleDownload = async (
    e: React.MouseEvent,
    url: string,
    title: string,
    date: string
  ) => {
    e.preventDefault();

    try {
      // 1. Format the date part (e.g., "January_2026")
      const dateObj = new Date(date);
      const dateString = dateObj
        .toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
        .replace(/\s+/g, "_"); // Replace space with underscore

      // 2. Sanitize the title (remove special characters and spaces)
      const cleanTitle = title
        .replace(/[^a-z0-9]/gi, "_") // Replace non-alphanumeric with underscore
        .replace(/_+/g, "_"); // Collapse multiple underscores

      const finalFileName = `${cleanTitle}_${dateString}`;

      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${finalFileName}.pdf`; // Forces the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup the temporary URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback: just open in new tab if fetch fails
      window.open(url, "_blank");
    }
  };

  /** --- RENDER PREVIEW MODE --- **/
  if (viewMode === "preview") {
    return (
      <>
        <div className="aspect-4/3 bg-stone-200 rounded-2xl shadow-inner flex items-center justify-center relative overflow-hidden group">
          {thumbnail && (
            <img
              src={thumbnail}
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm transition-transform duration-700 group-hover:scale-110"
              alt=""
            />
          )}

          <div className="text-center p-8 relative z-10">
            <div className="w-20 h-20 bg-white/80 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <BookOpen size={40} className="text-stone-600" />
            </div>

            <h2 className="text-3xl font-serif text-stone-900">
              {displayTitle}
            </h2>
            <p className="text-stone-600 mt-2 font-medium italic">
              {t("interactive_digital_edition")}
            </p>

            <button
              onClick={() => setViewMode("reader")}
              className="mt-8 bg-amber-800 text-white px-10 py-3.5 rounded-full font-bold shadow-lg hover:bg-amber-900 hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("read_issue_now")}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mt-6 gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-stone-900 text-lg">{displayTitle}</h3>
            <p className="text-sm text-stone-500 font-medium">
              {t("published")} {displayDate}
            </p>
          </div>
          <button
            onClick={(e) =>
              handleDownload(
                e,
                issue.pdfUrl,
                issue.title_en,
                issue.publishedDate
              )
            }
            className="flex items-center text-amber-800 font-bold hover:text-amber-900 transition-colors bg-amber-50 px-4 py-2 rounded-lg hover:bg-amber-100 hover:cursor-pointer"
          >
            <Download size={18} className="mr-2" />
            {t("download_pdf")}
          </button>
        </div>
      </>
    );
  }

  /** --- RENDER READER MODE --- **/
  return (
    <div className="space-y-4">
      <div className="relative bg-stone-900 rounded-2xl shadow-2xl overflow-hidden min-h-150 flex flex-col items-center justify-center border-4 border-stone-200">
        {/* Reader Header */}
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-40 bg-linear-to-b from-black/60 to-transparent">
          <button
            onClick={closeReader}
            className="flex items-center gap-2 text-white hover:text-amber-400 transition font-medium"
          >
            <ArrowLeft size={20} />
            <span>{t("back")}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-4 bg-stone-800/50 rounded-lg px-3 py-1 border border-white/10">
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
              className="text-white hover:text-amber-400"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-white text-xs font-mono w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2.0, s + 0.2))}
              className="text-white hover:text-amber-400"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button
              onClick={() => setScale(1.0)}
              className="text-white hover:text-amber-400"
              title="Reset Zoom"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <a
            href={issue.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white transition"
          >
            <Maximize2 size={20} />
          </a>
        </div>

        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-100">
            <Loader2 className="w-10 h-10 animate-spin text-amber-700 mb-4" />
            <p className="text-stone-600 font-medium">
              {t("preparing_reader")}
            </p>
          </div>
        )}

        <div className="pt-20 pb-24 w-full flex justify-center overflow-auto max-h-[80vh] custom-scrollbar scroll-smooth">
          <Document
            file={issue.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
          >
            <div
              className="transition-transform duration-300 ease-out origin-top will-change-transform"
              style={{
                transform: `scale(${scale})`,
              }}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={
                  window.innerWidth > 1024
                    ? 600
                    : window.innerWidth > 640
                      ? 500
                      : 300
                }
              />
            </div>
          </Document>
        </div>

        {isLoaded && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-stone-900/90 backdrop-blur text-white px-6 py-2 rounded-full z-30 border border-white/10">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="disabled:opacity-30"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-medium tabular-nums">
              {t("page")} {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="disabled:opacity-30"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MagazineViewer;

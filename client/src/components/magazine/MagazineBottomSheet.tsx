import React, { useState } from "react";
import { X, Download, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PublicMagazine } from "../../types/magazine.public";
import { getLocalized } from "../../utils/lang.utils";
import MagazineViewer from "./MagazineViewer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  issue: PublicMagazine | null;
}

const MagazineBottomSheet: React.FC<Props> = ({ isOpen, onClose, issue }) => {
  const { t, i18n } = useTranslation("magazine");
  const [showReader, setShowReader] = useState(false);

  if (!issue) return null;

  const displayTitle = getLocalized(issue, "title", i18n.language);
  const displayDate = new Date(issue.publishedDate).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const thumbnail = issue.pdfUrl?.replace(/\.pdf$/, ".jpg");

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(issue.pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${displayTitle.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(issue.pdfUrl, "_blank");
    }
  };

  // Reset reader state when the bottom sheet itself is closed
  const handleSheetClose = () => {
    setShowReader(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleSheetClose}
      />

      {/* Sheet Container */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[2.5rem] shadow-2xl transition-transform duration-300 ease-out lg:hidden transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle cue for dragging feel */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-stone-200 rounded-full" />
        </div>

        <button
          onClick={handleSheetClose}
          className="absolute top-6 right-6 p-2 bg-stone-100 rounded-full text-stone-500"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-4 space-y-8">
          {/* Magazine Info Section */}
          <div className="flex gap-6 items-center">
            <div className="relative shrink-0">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={displayTitle}
                  className="w-20 h-28 object-cover rounded-xl shadow-md border border-stone-100"
                />
              ) : (
                <div className="w-20 h-28 bg-stone-100 rounded-xl flex items-center justify-center border border-stone-200">
                  <BookOpen className="text-stone-300" size={32} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-xl font-serif text-stone-900 leading-tight mb-1 truncate">
                {displayTitle}
              </h3>
              <p className="text-sm text-stone-500 font-medium uppercase tracking-wide">
                {t("published")} {" : "} {displayDate}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pb-4">
            <button
              onClick={() => setShowReader(true)}
              className="w-full bg-amber-800 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <BookOpen size={20} />
              {t("read_issue_now")}
            </button>

            <button
              onClick={handleDownload}
              className="w-full bg-stone-50 text-stone-700 border border-stone-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Download size={20} />
              {t("download_pdf")}
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Reader Layer */}
      {showReader && (
        <MagazineViewer
          issue={issue}
          initialViewMode="reader"
          onClose={() => setShowReader(false)}
        />
      )}
    </>
  );
};

export default MagazineBottomSheet;

import { BookOpen, Download } from "lucide-react";
import type { PublicMagazine } from "../../types/magazine.public";

interface Props {
  issue: PublicMagazine | null;
}

const MagazineViewer: React.FC<Props> = ({ issue }) => {
  if (!issue) {
    return (
      <div className="aspect-4/3 bg-stone-100 rounded-2xl animate-pulse" />
    );
  }

  // Format the date for the "Edition" line
  const displayDate = new Date(issue.publishedDate).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  return (
    <>
      {/* Visual Preview / Action Area */}
      <div className="aspect-4/3 bg-stone-200 rounded-2xl shadow-inner flex items-center justify-center relative overflow-hidden group">
        {/* Background Decorative Element (Cover Image blurred) */}
        {issue.coverImageUrl && (
          <img
            src={issue.coverImageUrl}
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm transition-transform duration-700 group-hover:scale-110"
            alt=""
          />
        )}

        <div className="text-center p-8 relative z-10">
          <BookOpen
            size={60}
            strokeWidth={1.5}
            className="mx-auto text-stone-600 mb-4"
          />

          <h2 className="text-3xl font-serif text-stone-900">{issue.title}</h2>
          <p className="text-stone-600 mt-2 font-medium italic">
            Interactive Digital Edition
          </p>

          <a
            href={issue.flipbookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 bg-amber-800 text-white px-10 py-3.5 rounded-full font-bold shadow-lg hover:bg-amber-900 hover:-translate-y-0.5 transition-all duration-300"
          >
            Read Issue Now
          </a>
        </div>
      </div>

      {/* Info & Download Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mt-6 gap-4">
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-stone-900 text-lg">{issue.title}</h3>
          <p className="text-sm text-stone-500 font-medium">
            Published {displayDate}
          </p>
        </div>

        {issue.downloadUrl && (
          <a
            href={issue.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-amber-800 font-bold hover:text-amber-900 transition-colors bg-amber-50 px-4 py-2 rounded-lg"
          >
            <Download size={18} strokeWidth={2.5} className="mr-2" />
            Download PDF
          </a>
        )}
      </div>
    </>
  );
};

export default MagazineViewer;

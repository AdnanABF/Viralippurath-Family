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

  return (
    <>
      <div className="aspect-4/3 bg-stone-200 rounded-2xl shadow-inner flex items-center justify-center relative overflow-hidden">
        <div className="text-center p-8">
          <svg
            className="w-16 h-16 mx-auto text-stone-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>

          <h2 className="text-2xl font-serif text-stone-800">{issue.title}</h2>
          <p className="text-stone-500 mt-2">Click to open flipbook viewer</p>

          <button className="mt-8 bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition-all">
            Open Viewer
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-stone-200 mt-6">
        <div>
          <h3 className="font-bold text-stone-800">{issue.title}</h3>
          <p className="text-sm text-stone-500">Edition {issue.year}</p>
        </div>

        <a
          href={issue.downloadUrl}
          className="flex items-center text-amber-700 font-semibold hover:underline"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </a>
      </div>
    </>
  );
};

export default MagazineViewer;

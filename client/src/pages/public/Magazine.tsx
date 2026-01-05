import { useEffect, useState } from "react";
import api from "../../services/api";
import MagazineHeader from "../../components/magazine/MagazineHeader";
import MagazineViewer from "../../components/magazine/MagazineViewer";
import MagazineArchive from "../../components/magazine/MagazineArchive";
import type { PublicMagazine } from "../../types/magazine.public";

const Magazine = () => {
  const [issues, setIssues] = useState<PublicMagazine[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<PublicMagazine | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await api.get<PublicMagazine[]>("/magazine/published");

        const data = response.data;
        setIssues(data);

        // Auto-select the most recent issue if one exists
        if (data.length > 0) {
          setSelectedIssue(data[0]);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MagazineHeader />

        {error ? (
          /* Error State */
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200 shadow-sm">
            <h3 className="text-stone-800 font-serif text-xl mb-2">
              Unable to load magazines
            </h3>
            <p className="text-stone-500">
              Please check back later to view our family archives.
            </p>
          </div>
        ) : (
          <>
            {loading ? (
              /* Loading State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
                <p className="mt-4 text-stone-500 font-medium">
                  Loading archives...
                </p>
              </div>
            ) : issues.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-stone-500 italic">
                  No magazine issues have been published yet.
                </p>
              </div>
            ) : (
              /* Content State */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <MagazineArchive
                  issues={issues}
                  selectedId={selectedIssue?.uuid}
                  onSelect={setSelectedIssue}
                />

                {/* Viewer takes the selected issue. 
                   We use the uuid as a key to force a re-render/reset 
                   of the PDF reader when the user switches issues.
                */}
                <div className="lg:col-span-2 space-y-6">
                  <MagazineViewer
                    key={selectedIssue?.uuid}
                    issue={selectedIssue}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Magazine;

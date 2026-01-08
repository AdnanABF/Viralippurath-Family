import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "../../services/public.service";
import MagazineHeader from "../../components/magazine/MagazineHeader";
import MagazineViewer from "../../components/magazine/MagazineViewer";
import MagazineArchive from "../../components/magazine/MagazineArchive";
import type { PublicMagazine } from "../../types/magazine.public";
import { AdminLoading, AdminError } from "../../components/ui";

const Magazine = () => {
  const [selectedIssue, setSelectedIssue] = useState<PublicMagazine | null>(
    null
  );

  // 1. Fetch Magazines Data
  const {
    data: issues = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PublicMagazine[]>({
    queryKey: ["public-magazines"],
    queryFn: publicService.getMagazines,
  });

  // 2. Auto-select the most recent issue when data first arrives
  useEffect(() => {
    if (issues.length > 0 && !selectedIssue) {
      setSelectedIssue(issues[0]);
    }
  }, [issues, selectedIssue]);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MagazineHeader />

        {isError ? (
          <AdminError
            title="Unable to load magazines"
            message="Please check back later to view our family archives."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {isLoading ? (
              <AdminLoading message="Loading archives..." />
            ) : issues.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-stone-500 italic">
                  No magazine issues have been published yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <MagazineArchive
                  issues={issues}
                  selectedId={selectedIssue?.uuid}
                  onSelect={setSelectedIssue}
                />

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

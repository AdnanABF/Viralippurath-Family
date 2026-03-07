import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "../../services/public.service";
import MagazineHeader from "../../components/magazine/MagazineHeader";
import MagazineViewer from "../../components/magazine/MagazineViewer";
import MagazineArchive from "../../components/magazine/MagazineArchive";
import MagazineBottomSheet from "../../components/magazine/MagazineBottomSheet";
import type { PublicMagazine } from "../../types/magazine.public";
import { AdminLoading, AdminError } from "../../components/ui";
import { useTranslation } from "react-i18next";

const Magazine = () => {
  const { t } = useTranslation("magazine");
  const [selectedIssue, setSelectedIssue] = useState<PublicMagazine | null>(
    null
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const resolvedSelectedIssue =
    issues.find((issue) => issue.uuid === selectedIssue?.uuid) ??
    issues[0] ??
    null;

  const handleSelectIssue = (issue: PublicMagazine) => {
    setSelectedIssue(issue);
    setIsSheetOpen(true);
  };

  return (
    <div className="py-15 sm:py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MagazineHeader />

        {isError ? (
          <AdminError
            title={t("error_title")}
            message={t("error_message")}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {isLoading ? (
              <AdminLoading message={t("loading_message")} />
            ) : issues.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-stone-500 italic">
                  {t("no_magazine_message")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <MagazineArchive
                  issues={issues}
                  selectedId={resolvedSelectedIssue?.uuid}
                  onSelect={handleSelectIssue}
                />

                <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-28 self-start space-y-6">
                  <MagazineViewer
                    key={resolvedSelectedIssue?.uuid}
                    issue={resolvedSelectedIssue}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <MagazineBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        issue={resolvedSelectedIssue}
      />
    </div>
  );
};

export default Magazine;

import { useState } from "react";
import MagazineHeader from "../../components/magazine/MagazineHeader";
import MagazineViewer from "../../components/magazine/MagazineViewer";
import MagazineArchive from "../../components/magazine/MagazineArchive";
import { magazineIssues } from "../../components/magazine/magazine.mock";

const Magazine = () => {
  const [selectedIssue, setSelectedIssue] = useState(magazineIssues[0] ?? null);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MagazineHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <MagazineViewer issue={selectedIssue} />
          </div>

          <MagazineArchive
            issues={magazineIssues}
            selectedId={selectedIssue?.id}
            onSelect={setSelectedIssue}
          />
        </div>
      </div>
    </div>
  );
};

export default Magazine;

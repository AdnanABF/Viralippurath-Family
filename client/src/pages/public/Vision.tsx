import VisionHeader from "../../components/vision/VisionHeader";
import MissionSection from "../../components/vision/MissionSection";
import PromiseSection from "../../components/vision/PromiseSection";

const Vision = () => {
  return (
    <div className="py-15 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <VisionHeader />

        <div className="space-y-24">
          <MissionSection />
          <PromiseSection />
        </div>
      </div>
    </div>
  );
};

export default Vision;

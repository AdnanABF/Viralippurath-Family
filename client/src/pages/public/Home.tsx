import HeroSection from "../../components/home/HeroSection";
import IntroSection from "../../components/home/IntroSection";
import NotificationsPreview from "../../components/home/NotificationsPreview";

const Home = () => {
  return (
    <div className="animate-fadeIn">
      <HeroSection />
      <IntroSection />
      <NotificationsPreview />
    </div>
  );
};

export default Home;

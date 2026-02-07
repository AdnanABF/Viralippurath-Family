import AboutImage from "../../components/about/AboutImage";
import AboutContent from "../../components/about/AboutContent";
import Contact from "./Contact";

const About = () => {
  return (
    <div className="py-15 sm:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 lg:sticky lg:self-start lg:top-26.25">
            <AboutImage />
          </div>

          <div className="order-1 lg:order-2">
            <AboutContent />
          </div>
        </div>

        <Contact />
      </div>
    </div>
  );
};

export default About;

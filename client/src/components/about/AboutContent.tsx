import AboutPresence from "./AboutPresence";

const AboutContent = () => {
  return (
    <>
      <h1 className="text-5xl font-serif text-stone-900 mb-8 tracking-tight">
        Roots that run deep
      </h1>

      <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
        <p>
          The Viralippurath family lineage dates back to the early 1900s,
          originating from the fertile lands of central Kerala. Our ancestors
          were known for their agrarian excellence and community leadership.
        </p>

        <p>
          Over the decades, members of our family have ventured into diverse
          fields—from medicine and engineering to arts and entrepreneurship—
          carrying the values of hard work and integrity to every corner of the
          world.
        </p>

        <p className="font-serif italic text-stone-800">
          "We don't just inherit a name; we inherit a responsibility to do
          good."
        </p>

        <AboutPresence />
      </div>
    </>
  );
};

export default AboutContent;

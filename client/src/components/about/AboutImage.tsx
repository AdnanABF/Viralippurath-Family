const AboutImage = () => {
  return (
    <div className="relative">
      <img
        src="https://picsum.photos/800/1000?sig=history"
        alt="Old Tharavadu"
        className="rounded-2xl shadow-2xl relative z-10"
      />
      <div className="absolute -top-4 -left-4 w-full h-full border-2 border-amber-700 rounded-2xl z-0" />
    </div>
  );
};

export default AboutImage;

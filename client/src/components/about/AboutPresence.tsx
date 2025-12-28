const countries = ["India", "USA", "UK", "UAE", "Australia", "Germany"];

const AboutPresence = () => {
  return (
    <div className="pt-8 border-t border-stone-200">
      <h3 className="font-bold text-stone-900 mb-4 uppercase tracking-widest text-xs">
        Our Global Presence
      </h3>

      <div className="flex flex-wrap gap-4">
        {countries.map((country) => (
          <span
            key={country}
            className="bg-white px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 shadow-sm"
          >
            {country}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AboutPresence;

const IntroSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-700 font-bold uppercase tracking-widest text-sm">
              Welcome
            </span>

            <h2 className="text-4xl font-serif text-stone-900 mt-4 mb-6">
              Preserving a century of togetherness
            </h2>

            <p className="text-stone-600 leading-relaxed text-lg mb-6">
              The Viralippurath family represents a rich tapestry of history,
              culture, and values passed down through generations. From our
              ancestral roots in Kerala to members across the globe, we remain
              united by lineage.
            </p>

            <p className="malayalam text-lg text-stone-700 italic border-l-4 border-amber-700 pl-4 py-2">
              വിരാലിപ്പുറം കുടുംബം - പാരമ്പര്യവും സ്നേഹവും ഇഴചേർന്ന ഒരു യാത്ര.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://picsum.photos/400/500?sig=a1"
              alt="Heritage"
              className="rounded-2xl shadow-lg mt-8"
            />
            <img
              src="https://picsum.photos/400/500?sig=a2"
              alt="Unity"
              className="rounded-2xl shadow-lg -mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;

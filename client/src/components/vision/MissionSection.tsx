const MissionSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-serif text-stone-800 mb-6">The Mission</h2>
        <p className="text-stone-600 leading-relaxed text-lg italic">
          "To foster a supportive ecosystem for every Viralippurath family
          member, ensuring our heritage remains a living inspiration for
          generations to come."
        </p>
      </div>

      <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
        <h3 className="font-bold text-stone-800 mb-4 uppercase tracking-wider text-sm">
          Core Values
        </h3>

        <ul className="space-y-4 text-stone-600">
          <li className="flex items-start">
            <span className="text-amber-700 mr-3">✦</span>
            <span>
              <strong>Unity in Diversity:</strong> Celebrating our individual
              paths while staying rooted in one home.
            </span>
          </li>

          <li className="flex items-start">
            <span className="text-amber-700 mr-3">✦</span>
            <span>
              <strong>Education:</strong> Investing in the intellectual growth
              of our youth.
            </span>
          </li>

          <li className="flex items-start">
            <span className="text-amber-700 mr-3">✦</span>
            <span>
              <strong>Tradition:</strong> Preserving the rituals and stories
              that define us.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default MissionSection;

const ContactForm = () => {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Full Name
          </label>
          <input
            type="text"
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
            placeholder="Enter email"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Subject
        </label>
        <input
          type="text"
          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
          placeholder="What is this regarding?"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Message
        </label>
        <textarea
          rows={5}
          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
          placeholder="Your message..."
        />
      </div>

      <button
        type="button"
        className="w-full bg-amber-700 text-white font-bold py-4 rounded-xl hover:bg-amber-800 transition-all shadow-lg hover:shadow-xl"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;

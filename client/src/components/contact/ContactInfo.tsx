const ContactInfo = () => {
  return (
    <div className="space-y-8 mt-12">
      <div className="flex items-start">
        <div className="bg-amber-100 p-3 rounded-xl mr-4 text-amber-800">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-stone-800">Email Address</h4>
          <p className="text-stone-500">viralippurathkudumbam@gmail.com</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="bg-stone-100 p-3 rounded-xl mr-4 text-stone-800">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-stone-800">Mookkuthala</h4>
          <p className="text-stone-500">
            Viralippurath House, Kerala, IN - 679574
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;

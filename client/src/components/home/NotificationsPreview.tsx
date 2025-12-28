import { Link } from "react-router-dom";

type Notification = {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "HIGH" | "NORMAL";
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Annual Family Meet 2025",
    content:
      "The annual family gathering will be held in January. Details will follow.",
    date: "2024-12-20",
    priority: "HIGH",
  },
  {
    id: "2",
    title: "Magazine Submissions Open",
    content: "Family members are invited to submit articles and photos.",
    date: "2024-12-10",
    priority: "NORMAL",
  },
  {
    id: "3",
    title: "New Website Launched",
    content: "Welcome to the official Viralippurath family website.",
    date: "2024-12-01",
    priority: "NORMAL",
  },
];

const NotificationsPreview = () => {
  return (
    <section className="py-16 bg-stone-50 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-serif text-stone-900">
              Latest Updates
            </h2>
            <p className="text-stone-500">Stay informed about family news</p>
          </div>

          <Link
            to="/notifications"
            className="text-amber-700 font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNotifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                    notif.priority === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {notif.priority}
                </span>
                <span className="text-xs text-stone-400">{notif.date}</span>
              </div>

              <h3 className="text-lg font-bold text-stone-800 mb-2">
                {notif.title}
              </h3>

              <p className="text-stone-600 text-sm line-clamp-3">
                {notif.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotificationsPreview;

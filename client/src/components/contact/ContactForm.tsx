import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api"; // Adjust path based on your folder structure

const ContactForm = () => {
  // 1. Setup local state following your standard pattern
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });

  // 2. Handle input changes dynamically
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sends data to the NestJS /contact endpoint we just created
      await api.post("/contact", formData);

      toast.success("Message sent successfully!");

      // Clear form on success
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "",
      });
    } catch (error) {
      // Error is handled by your global api.ts interceptor (toast.error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Full Name
          </label>
          <input
            required
            type="text"
            name="name" // Matches DTO
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Email
          </label>
          <input
            required
            type="email"
            name="email" // Matches DTO
            value={formData.email}
            onChange={handleChange}
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
          required
          type="text"
          name="subject" // Matches DTO
          value={formData.subject}
          onChange={handleChange}
          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
          placeholder="What is this regarding?"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Message
        </label>
        <textarea
          required
          name="message" // Matches DTO
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
          placeholder="Your message..."
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit" // Changed from type="button" to "submit"
        disabled={loading}
        className="w-full bg-amber-700 text-white font-bold py-4 rounded-xl hover:bg-amber-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {loading ? "Sending Message..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;

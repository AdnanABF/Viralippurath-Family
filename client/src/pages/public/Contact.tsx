import ContactHeader from "../../components/contact/ContactHeader";
import ContactInfo from "../../components/contact/ContactInfo";
import ContactForm from "../../components/contact/ContactForm";

const Contact = () => {
  return (
    <div className="py-24 bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <ContactHeader />
            <ContactInfo />
          </div>

          <div className="bg-stone-50 p-8 md:p-12 rounded-3xl border border-stone-200">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

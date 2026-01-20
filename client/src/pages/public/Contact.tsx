import ContactHeader from "../../components/contact/ContactHeader";
import ContactInfo from "../../components/contact/ContactInfo";
import ContactForm from "../../components/contact/ContactForm";

const Contact = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-5 pt-3 sm:mt-10 sm:pt-8 border-t border-stone-200">
      <div>
        <ContactHeader />
        <ContactInfo />
      </div>

      <div className="bg-stone-50 p-8 md:p-12 rounded-3xl border border-stone-200">
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;

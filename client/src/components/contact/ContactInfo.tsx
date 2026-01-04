import { Mail, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-8 mt-12">
      <div className="flex items-start">
        <div className="bg-amber-100 p-3 rounded-xl mr-4 text-amber-800">
          <Mail />
        </div>
        <div>
          <h4 className="font-bold text-stone-800">Email Address</h4>
          <p className="text-stone-500">viralippurathkudumbam@gmail.com</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="bg-stone-100 p-3 rounded-xl mr-4 text-stone-800">
          <MapPin />
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

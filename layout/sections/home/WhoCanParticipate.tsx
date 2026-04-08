// components/sections/WhoCanParticipate.tsx
import { Calendar, Activity, MapPin, ClipboardCheck } from "lucide-react";

const requirements = [
  {
    icon: Calendar,
    title: "Age Requirement",
    description: "Must be 21 years or older",
  },
  {
    icon: Activity,
    title: "Physical & Mental Fitness",
    description: "Pass medical and psychological screening",
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Open to international applicants (visa assistance available)",
  },
  {
    icon: ClipboardCheck,
    title: "Screening Process",
    description: "Background check + in-person interview",
  },
];

export default function WhoCanParticipate() {
  return (
    <section id="who-can-participate" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide">
              WHO CAN PARTICIPATE
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Are You Eligible?
          </h2>
          <p className="text-gray-600 text-lg">
            We're looking for mentally strong individuals ready to push their limits
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {requirements.map((req, i) => (
            <div key={i} className="bg-white border border-gray-200 p-6 text-center hover:border-orange-200 transition-all">
              <div className="w-12 h-12 bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <req.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{req.title}</h3>
              <p className="text-sm text-gray-500">{req.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            * Screening includes medical evaluation, psychological assessment, and background check
          </p>
        </div>
      </div>
    </section>
  );
}
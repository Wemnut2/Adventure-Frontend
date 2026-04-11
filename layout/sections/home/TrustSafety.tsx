import { Shield, HeartHandshake, Eye, FileCheck } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "24/7 Supervision",
    description:
      "Medical team always on standby with emergency response protocols ready at all times.",
  },
  {
    icon: HeartHandshake,
    title: "Medical Precautions",
    description:
      "Rigorous pre-screening plus regular non-verbal health check-ins throughout isolation.",
  },
  {
    icon: Eye,
    title: "Transparent Rules",
    description:
      "Every condition, rule, and expectation is fully disclosed before you sign anything.",
  },
  {
    icon: FileCheck,
    title: "Insured & Bonded",
    description:
      "The Adventure Limited is fully insured and bonded for participant protection.",
  },
];

export default function TrustSafety() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              Trust & Safety
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Your Wellbeing Is Our Priority
          </h2>
          <p className="text-gray-500 text-lg">
            We've designed every aspect with participant safety in mind
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-orange-200 transition-colors group"
            >
              <div className="w-12 h-12 bg-orange-50 group-hover:bg-orange-100 transition-colors rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Compliance note */}
        <div className="mt-10 max-w-xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              All challenges comply with international safety standards and are overseen by{" "}
              <span className="font-semibold text-gray-700">licensed medical professionals</span>.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
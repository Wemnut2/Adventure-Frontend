// components/sections/Testimonials.tsx
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I lasted 14 days. The first 3 were brutal, but what I learned about myself is priceless.",
    name: "Sarah Chen",
    duration: "14 Days",
    reward: "$25,000",
  },
  {
    quote: "This challenge rewired my brain. I stopped needing constant stimulation.",
    name: "Marcus Williams",
    duration: "21 Days",
    reward: "$35,000",
  },
  {
    quote: "Professional athletes train their bodies. This trains your mind.",
    name: "Dr. Emily Rhodes",
    duration: "Completed 30 Days",
    reward: "$60,000",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide">
              PARTICIPANT STORIES
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Real Experiences. Real Transformations.
          </h2>
          <p className="text-gray-600 text-lg">
            What our past challengers have to say
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
              <div className="pt-4 border-t border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t.duration}</span>
                  <span className="text-orange-600 font-semibold">{t.reward}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">More testimonials coming soon from upcoming challenges</p>
        </div>
      </div>
    </section>
  );
}
"use client";
import Image from "next/image";

import { Star } from "lucide-react";
// import Image from "next/image"; // ← Uncomment when you're ready to use images

const testimonials = [
  {
    quote:
      "I lasted 14 days. The first 3 were brutal, but what I learned about myself is priceless.",
    name: "Sarah Chen",
    duration: "14 Days",
    reward: "$25,000",
    proofImage: "/photo_2026-04-09_23-45-16.jpg",
  },
  {
    quote:
      "This challenge rewired my brain. I stopped needing constant stimulation.",
    name: "Marcus Williams",
    duration: "21 Days",
    reward: "$35,000",
    proofImage: "/photo_2026-04-09_23-45-46.jpg",
  },
  {
    quote:
      "Professional athletes train their bodies. This trains your mind.",
    name: "Dr. Emily Rhodes",
    duration: "Completed 30 Days",
    reward: "$60,000",
    proofImage: "/photo_2026-04-09_23-45-40.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              Participant Stories
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Real Experiences. Real Transformations.
          </h2>
          <p className="text-gray-500 text-lg">
            What our past challengers have to say
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col hover:border-orange-200 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-sm leading-relaxed italic flex-1 mb-6">
                "{t.quote}"
              </p>

              {/* ================= PROOF IMAGE SECTION (COMMENTED OUT) ================= */}
              
              {t.proofImage && (
                <div className="mb-6">
                  <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <Image
                      src={t.proofImage}
                      alt={`${t.name} reward proof`}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Verified reward proof
                  </p>
                </div>
              )}
             
              {/* ===================================================================== */}

              {/* Divider */}
              <div className="border-t border-gray-200 pt-5">
                <div className="flex items-center gap-4">

                  {/* Profile Placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex-shrink-0 overflow-hidden">
                    {/* 
                      Replace with real image later:
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-[11px] font-semibold text-gray-400">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {t.name}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-400">
                        {t.duration}
                      </span>
                      <span className="text-xs font-semibold text-orange-600">
                        {t.reward}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          More testimonials coming soon from upcoming challenges
        </p>
      </div>
    </section>
  );
}
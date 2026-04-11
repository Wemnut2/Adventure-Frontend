

import { Brain, Clock, Target } from "lucide-react";

const miniCards = [
  {
    icon: Brain,
    title: "Mental Strength",
    sub: "Push beyond limits",
  },
  {
    icon: Clock,
    title: "Time Endurance",
    sub: "From 24h to 30+ days",
  },
  {
    icon: Target,
    title: "Self Discovery",
    sub: "Know yourself better",
  },
];

const whoFor = [
  "Adventurers seeking unique challenges",
  "Individuals wanting to test their limits",
  "People looking for self-discovery",
  "Those seeking a life-changing reward",
];

export default function AboutChallenge() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              About the Challenge
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            What Is The Isolated Challenge?
          </h2>
          <p className="text-gray-500 text-lg">
            An endurance experience designed to push your mental limits
          </p>
        </div>

        {/* Two-col layout */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left */}
          <div>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Isolated Challenge is an endurance experience where participants
              stay alone in a controlled environment with{" "}
              <span className="font-semibold text-gray-900">no external communication</span>.
              Your mission is simple:{" "}
              <span className="font-semibold text-gray-900">last as long as you can</span>.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              No phones, no internet, no human contact — just you, your thoughts,
              and the silence. It's the ultimate test of mental fortitude and
              self-discipline.
            </p>

            {/* Mini cards */}
            <div className="grid grid-cols-3 gap-3">
              {miniCards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <card.icon className="w-5 h-5 text-orange-500 mb-2" />
                  <h4 className="font-semibold text-gray-900 text-xs mb-1">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-500">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — who it's for */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Who Is This For?</h3>
            <ul className="space-y-3">
              {whoFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-semibold text-orange-600">Unique:</span> No other
                challenge combines complete isolation with tiered cash rewards at this scale.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
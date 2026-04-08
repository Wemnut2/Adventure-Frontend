// components/sections/AboutChallenge.tsx
import { Brain, Clock, Target } from "lucide-react";

export default function AboutChallenge() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide">
              ABOUT THE CHALLENGE
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            What Is The Isolated Challenge?
          </h2>
          <p className="text-gray-600 text-lg">
            An endurance experience designed to push your mental limits
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              The Isolated Challenge is an endurance experience where participants 
              stay alone in a controlled environment with <span className="font-semibold text-gray-900">no external communication</span>. 
              Your mission is simple: <span className="font-semibold text-gray-900">last as long as you can</span>.
            </p>
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              No phones, no internet, no human contact — just you, your thoughts, 
              and the silence. It's the ultimate test of mental fortitude and self-discipline.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-white border border-gray-200">
                <Brain className="w-6 h-6 text-orange-500 mb-2" />
                <h4 className="font-semibold text-gray-900 text-sm">Mental Strength</h4>
                <p className="text-xs text-gray-500 mt-1">Push beyond limits</p>
              </div>
              <div className="p-4 bg-white border border-gray-200">
                <Clock className="w-6 h-6 text-orange-500 mb-2" />
                <h4 className="font-semibold text-gray-900 text-sm">Time Endurance</h4>
                <p className="text-xs text-gray-500 mt-1">From 24h to 30 days</p>
              </div>
              <div className="p-4 bg-white border border-gray-200">
                <Target className="w-6 h-6 text-orange-500 mb-2" />
                <h4 className="font-semibold text-gray-900 text-sm">Self Discovery</h4>
                <p className="text-xs text-gray-500 mt-1">Know yourself better</p>
              </div>
            </div>
          </div>

          {/* Who it's for */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Who Is This For?</h3>
            <ul className="space-y-3">
              {[
                "Adventurers seeking unique challenges",
                "Individuals wanting to test their limits",
                "People looking for self-discovery",
                "Those seeking a life-changing reward",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-orange-600">Unique:</span> No other challenge 
                combines complete isolation with tiered cash rewards at this scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
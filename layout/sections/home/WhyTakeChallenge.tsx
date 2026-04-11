import { Brain, Zap, Trophy, Users } from "lucide-react";

const reasons = [
  {
    icon: Brain,
    title: "Test Your Limits",
    description: "Discover mental resilience you never knew you had",
  },
  {
    icon: Zap,
    title: "Self-Discovery",
    description: "Learn who you are when all distractions are removed",
  },
  {
    icon: Trophy,
    title: "Discipline & Mental Strength",
    description: "Build unshakeable focus and emotional control",
  },
  {
    icon: Users,
    title: "Fame & Recognition",
    description: "Top performers featured in our Hall of Fame",
  },
];

export default function WhyTakeChallenge() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              Why Take the Challenge
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            More Than Just a Reward
          </h2>
          <p className="text-gray-500 text-lg">
            The real prize is what you discover about yourself
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center group hover:border-orange-200 transition-all hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-orange-50 group-hover:bg-orange-100 transition-colors rounded-xl flex items-center justify-center mx-auto mb-4">
                <reason.icon className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <p className="text-center text-sm text-gray-400 italic mt-12">
          "The person who leaves the room is never the same as the person who entered."
        </p>

      </div>
    </section>
  );
}
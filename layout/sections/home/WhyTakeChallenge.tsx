// components/sections/WhyTakeChallenge.tsx
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
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide">
              WHY TAKE THE CHALLENGE
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            More Than Just a Reward
          </h2>
          <p className="text-gray-600 text-lg">
            The real prize is what you discover about yourself
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <div key={i} className="bg-white border border-gray-200 p-6 text-center group hover:border-orange-200 transition-all">
              <div className="w-14 h-14 bg-orange-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors">
                <reason.icon className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-500">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-sm italic">
            "The person who leaves the room is never the same as the person who entered."
          </p>
        </div>
      </div>
    </section>
  );
}
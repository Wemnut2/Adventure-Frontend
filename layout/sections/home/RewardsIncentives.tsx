

import { Award, Zap } from "lucide-react";

const tiers = [
  {
    duration: "24 Hours",
    reward: "$1,500",
    iconColor: "text-gray-500",
    bg: "bg-gray-50",
  },
  {
    duration: "72 Hours",
    reward: "$5,000",
    iconColor: "text-orange-400",
    bg: "bg-orange-50",
  },
  {
    duration: "1 Week",
    reward: "$15,000",
    iconColor: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    duration: "2 Weeks",
    reward: "$50,000",
    iconColor: "text-orange-600",
    bg: "bg-orange-100",
    featured: true,
  },
  {
    duration: "30+ Days",
    reward: "$100,000+",
    iconColor: "text-orange-700",
    bg: "bg-orange-100",
    featured: true,
  },
];

export default function RewardsIncentives() {
  return (
    <section id="rewards" className="py-20 bg-gray-50">
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              Rewards & Incentives
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            The Longer You Endure, The Greater Your Reward
          </h2>
          <p className="text-gray-500 text-lg">
            Tiered cash rewards based on your isolation duration
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`${tier.bg} border rounded-xl p-5 text-center transition-all hover:-translate-y-1 ${
                tier.featured
                  ? "border-orange-300"
                  : "border-gray-200 hover:border-orange-200"
              }`}
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Award className={`w-5 h-5 ${tier.iconColor}`} />
              </div>
              <p className="text-xs font-semibold text-gray-700 mb-1">{tier.duration}</p>
              <p className="text-xl font-bold text-orange-500">{tier.reward}</p>
            </div>
          ))}
        </div>

        {/* Bonus bar */}
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Completion Bonus</p>
              <p className="text-xs text-gray-500">Finish the full 30+ days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-500">+$100,000</p>
            <p className="text-xs text-gray-500">on top of tier reward</p>
          </div>
        </div>

      </div>
    </section>
  );
}
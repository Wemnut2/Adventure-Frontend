// components/sections/RewardsIncentives.tsx
import { Award, TrendingUp, Target, Zap } from "lucide-react";

const tiers = [
  { duration: "24 Hours", reward: "$500", color: "from-gray-400 to-gray-500" },
  { duration: "72 Hours", reward: "$2,000", color: "from-orange-400 to-orange-500" },
  { duration: "1 Week", reward: "$10,000", color: "from-orange-500 to-orange-600" },
  { duration: "2 Weeks", reward: "$25,000", color: "from-orange-600 to-orange-700" },
  { duration: "Full Challenge (30 Days)", reward: "$50,000", color: "from-orange-700 to-orange-800" },
];

export default function RewardsIncentives() {
  return (
    <section id="rewards" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide">
              REWARDS & INCENTIVES
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            The Longer You Endure, The Greater Your Reward
          </h2>
          <p className="text-gray-600 text-lg">
            Tiered cash rewards based on your isolation duration
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {tiers.map((tier, index) => (
            <div key={index} className="bg-white border border-gray-200 p-5 text-center hover:border-orange-300 transition-all">
              <div className={`w-10 h-10 bg-gradient-to-r ${tier.color} flex items-center justify-center mx-auto mb-3`}>
                <Award className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{tier.duration}</p>
              <p className="text-xl font-bold text-orange-500 mt-1">{tier.reward}</p>
            </div>
          ))}
        </div>

        {/* Bonus Section */}
        <div className="bg-white border border-gray-200 p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 flex-wrap justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Completion Bonus</p>
                <p className="text-xs text-gray-500">Finish full 30 days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-500">+$10,000</p>
              <p className="text-xs text-gray-500">on top of tier reward</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  CheckSquare,
  Cpu,
  Globe,
  Lock,
  Repeat,
  Wallet,
} from "lucide-react";
import {
  useScrollAnimation,
  fadeUpVariants,
  staggerContainerVariants,
  scaleInVariants,
} from "@/libs/hooks/Usescrollanimation";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Portfolio Tracking",
    description:
      "Live dashboards with interactive charts. See your gains, losses, allocation, and performance metrics the moment they change.",
    size: "large",
    gradient: "from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    iconColor: "text-orange-500",
  },
  {
    icon: CheckSquare,
    title: "Task-Based Earning",
    description:
      "Complete micro-tasks — surveys, research, reviews — and earn cash that goes straight into your investment account.",
    size: "medium",
    gradient: "from-orange-50 to-orange-100/40",
    accent: "bg-orange-400",
    iconColor: "text-orange-400",
  },
  {
    icon: Cpu,
    title: "AI Investment Engine",
    description:
      "Our proprietary AI analyzes 1,000+ signals daily to recommend personalized opportunities aligned with your risk appetite.",
    size: "medium",
    gradient: "from-amber-50 to-orange-50",
    accent: "bg-amber-500",
    iconColor: "text-amber-500",
  },
  {
    icon: Wallet,
    title: "Auto-Invest",
    description:
      "Set rules and let InvestX automatically deploy your earnings into diversified assets on your schedule.",
    size: "small",
    gradient: "from-white to-orange-50",
    accent: "bg-orange-300",
    iconColor: "text-orange-600",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description:
      "256-bit encryption, 2FA, biometric auth, and cold storage for digital assets. Your money is always safe.",
    size: "small",
    gradient: "from-white to-amber-50",
    accent: "bg-amber-400",
    iconColor: "text-amber-600",
  },
  {
    icon: Globe,
    title: "Global Markets Access",
    description:
      "Trade US stocks, crypto, forex, ETFs, and commodities from one unified account — 24/7.",
    size: "medium",
    gradient: "from-orange-50 to-white",
    accent: "bg-orange-500",
    iconColor: "text-orange-500",
  },
  {
    icon: Repeat,
    title: "Compound Growth",
    description:
      "Automatic dividend reinvestment and yield compounding turns small gains into long-term wealth.",
    size: "small",
    gradient: "from-amber-50 to-white",
    accent: "bg-orange-400",
    iconColor: "text-orange-400",
  },
  {
    icon: Briefcase,
    title: "Managed Portfolios",
    description:
      "Choose from expert-curated portfolios ranging from conservative bonds to aggressive growth tech baskets.",
    size: "medium",
    gradient: "from-orange-100/30 to-amber-50",
    accent: "bg-amber-500",
    iconColor: "text-amber-500",
  },
];

function BentoCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  const gridClass = {
    large: "md:col-span-2 md:row-span-2",
    medium: "md:col-span-1",
    small: "md:col-span-1",
  }[feature.size];

  return (
    <motion.div
      variants={scaleInVariants}
      custom={index}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`${gridClass} group relative overflow-hidden rounded-3xl border border-orange-100/60 bg-gradient-to-br ${feature.gradient} p-6 lg:p-8 shadow-sm hover:shadow-md hover:shadow-orange-100/50 transition-shadow duration-300 cursor-default`}
    >
      {/* Decorative circle */}
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 ${feature.accent} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      />
      <div
        className={`absolute -bottom-8 -left-8 w-32 h-32 ${feature.accent} rounded-full opacity-5 group-hover:opacity-8 transition-opacity duration-300`}
      />

      <div
        className={`relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm mb-5`}
      >
        <Icon className={`w-5 h-5 ${feature.iconColor}`} />
      </div>

      <h3
        className="relative text-lg font-bold text-gray-900 mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {feature.title}
      </h3>
      <p className="relative text-sm text-gray-500 leading-relaxed">
        {feature.description}
      </p>

      {feature.size === "large" && (
        <div className="relative mt-6 bg-white/60 rounded-2xl p-4">
          <div className="flex items-end gap-2 h-20">
            {[45, 60, 40, 75, 55, 90, 70, 85, 95, 78].map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                style={{ originY: 1, height: `${h}%` }}
                className={`flex-1 rounded-t-md ${
                  i === 9
                    ? "bg-orange-500"
                    : i % 2 === 0
                    ? "bg-orange-200"
                    : "bg-orange-100"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400 font-mono">
            <span>Mar</span>
            <span>Jun</span>
            <span>Sep</span>
            <span>Now</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Features() {
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="features" className="py-24 lg:py-32 bg-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeUpVariants}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
            Everything You Need
          </div>
          <h2
            className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A Platform Built for
            <br />
            <span className="gradient-text">Serious Growth</span>
          </h2>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            Whether you're a first-time investor or a seasoned trader, InvestX
            gives you the tools, intelligence, and automation to build wealth
            consistently.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]"
        >
          {features.map((feature, i) => (
            <BentoCard key={feature.title} feature={feature} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
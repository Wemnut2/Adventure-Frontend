// components/sections/HowItWorks.tsx
import { FileText, Mail, DoorOpen, Clock, DoorClosed, Wallet } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Apply & Get Selected",
    description: "Submit your application and complete the screening process",
    step: "01",
  },
  {
    icon: Mail,
    title: "Receive Instructions",
    description: "Get detailed guidelines and preparation materials",
    step: "02",
  },
  {
    icon: DoorOpen,
    title: "Enter Isolation",
    description: "Step into the controlled environment space",
    step: "03",
  },
  {
    icon: Clock,
    title: "Stay As Long As Possible",
    description: "Endure solitude with no external contact",
    step: "04",
  },
  {
    icon: DoorClosed,
    title: "Exit Anytime",
    description: "Freedom to leave whenever you choose",
    step: "05",
  },
  {
    icon: Wallet,
    title: "Earn Rewards",
    description: "Get paid based on your duration completed",
    step: "06",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Simple 6-Step Process
          </h2>
          <p className="text-gray-600 text-lg">
            From application to reward — here's how the journey unfolds
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="group relative p-6 bg-gray-50 border border-gray-200 hover:border-orange-200 transition-all">
              {/* Step Number */}
              <div className="absolute top-4 right-4 text-4xl font-bold text-gray-200 group-hover:text-orange-100 transition-colors">
                {step.step}
              </div>
              <step.icon className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            ⚡ Early exit allowed at any time. Partial rewards based on duration completed.
          </p>
        </div>
      </div>
    </section>
  );
}
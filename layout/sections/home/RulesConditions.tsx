// // components/sections/RulesConditions.tsx
// import { Ban, PhoneOff, WifiOff, Heart, AlertTriangle, LogOut } from "lucide-react";

// const rules = [
//   { icon: PhoneOff, text: "No phones or personal devices", color: "text-orange-500" },
//   { icon: WifiOff, text: "No internet or external communication", color: "text-orange-500" },
//   { icon: Ban, text: "No human contact during isolation", color: "text-orange-500" },
//   { icon: Heart, text: "Daily health check-ins (non-verbal)", color: "text-green-500" },
//   { icon: AlertTriangle, text: "Disqualification for rule violations", color: "text-red-500" },
//   { icon: LogOut, text: "Exit anytime — no questions asked", color: "text-blue-500" },
// ];

// export default function RulesConditions() {
//   return (
//     <section id="rules" className="py-20 bg-white">
//       <div className="container-custom">
//         <div className="grid md:grid-cols-2 gap-12">
//           {/* Left Side - Rules */}
//           <div>
//             <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
//               <span className="text-xs font-semibold text-orange-600 tracking-wide">
//                 RULES & CONDITIONS
//               </span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
//               The Rules Are Simple. And Strict.
//             </h2>
//             <p className="text-gray-600 mb-6">
//               To ensure fairness and safety, all participants must adhere to these rules.
//             </p>
//             <div className="space-y-3">
//               {rules.map((rule, i) => (
//                 <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200">
//                   <rule.icon className={`w-5 h-5 ${rule.color}`} />
//                   <span className="text-sm text-gray-700">{rule.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Side - Exit & Safety */}
//           <div className="bg-gray-50 border border-gray-200 p-6">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Exit & Safety Protocol</h3>
//             <div className="space-y-4">
//               <div>
//                 <p className="font-semibold text-gray-800 text-sm mb-1">Voluntary Exit</p>
//                 <p className="text-sm text-gray-600">Press the exit button — door unlocks immediately. No penalties, just rewards based on time completed.</p>
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-800 text-sm mb-1">Emergency Protocol</p>
//                 <p className="text-sm text-gray-600">24/7 medical team on standby. Emergency button available at all times.</p>
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-800 text-sm mb-1">Disqualification</p>
//                 <p className="text-sm text-gray-600">Attempting to communicate outside, damaging equipment, or health risks will end your challenge.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { PhoneOff, WifiOff, Ban, Heart, AlertTriangle, LogOut } from "lucide-react";

const rules = [
  { icon: PhoneOff, text: "No phones or personal devices", color: "text-orange-500" },
  { icon: WifiOff, text: "No internet or external communication", color: "text-orange-500" },
  { icon: Ban, text: "No human contact during isolation", color: "text-orange-500" },
  { icon: Heart, text: "Daily health check-ins (non-verbal)", color: "text-green-500" },
  { icon: AlertTriangle, text: "Disqualification for rule violations", color: "text-red-500" },
  { icon: LogOut, text: "Exit anytime — no questions asked", color: "text-blue-500" },
];

const protocols = [
  {
    title: "Voluntary Exit",
    body: "Press the exit button — door unlocks immediately. No penalties, just rewards based on time completed.",
  },
  {
    title: "Emergency Protocol",
    body: "24/7 medical team on standby. Emergency button available at all times.",
  },
  {
    title: "Disqualification",
    body: "Attempting to communicate outside, damaging equipment, or health risks will end your challenge.",
  },
];

export default function RulesConditions() {
  return (
    <section id="rules" className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Left — Rules */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
              <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
                Rules & Conditions
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              The Rules Are Simple. And Strict.
            </h2>
            <p className="text-gray-500 mb-7">
              To ensure fairness and safety, all participants must adhere to these rules.
            </p>
            <div className="space-y-3">
              {rules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <rule.icon className={`w-5 h-5 flex-shrink-0 ${rule.color}`} />
                  <span className="text-sm text-gray-700">{rule.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Safety protocols */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Exit & Safety Protocol</h3>
            <div className="space-y-6">
              {protocols.map((p, i) => (
                <div key={i}>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{p.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
                  {i < protocols.length - 1 && (
                    <div className="h-px bg-gray-200 mt-5" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
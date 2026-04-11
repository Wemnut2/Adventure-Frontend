// // components/sections/AboutCompany.tsx
// import { Compass, Mail, MapPin, Phone } from "lucide-react";

// export default function AboutCompany() {
//   return (
//     <section className="py-20 bg-white">
//       <div className="container-custom">
//         <div className="grid md:grid-cols-2 gap-12">
//           <div>
//             <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
//               <span className="text-xs font-semibold text-orange-600 tracking-wide">
//                 ABOUT THE ADVENTURE LIMITED
//               </span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
//               Who We Are
//             </h2>
//             <p className="text-gray-600 mb-4">
//               The Adventure Limited is a premier experience design company specializing 
//               in transformative challenges that push human limits.
//             </p>
//             <p className="text-gray-600 mb-6">
//               Our mission is to create safe, meaningful experiences that help people 
//               discover their untapped potential. The Isolated Challenge is our flagship program.
//             </p>
//             <div className="flex items-center gap-3 text-sm text-gray-600">
//               <Compass className="w-4 h-4 text-orange-500" />
//               <span>Vision: Redefine human endurance experiences globally</span>
//             </div>
//           </div>

//           <div className="bg-gray-50 border border-gray-200 p-6">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
//             <div className="space-y-4">
//               <div className="flex items-start gap-3">
//                 <Mail className="w-4 h-4 text-orange-500 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">Email</p>
//                   <p className="text-sm text-gray-500">hello@theadventure.com</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Phone className="w-4 h-4 text-orange-500 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">Phone</p>
//                   <p className="text-sm text-gray-500">+1 (888) 424-7333</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">Headquarters</p>
//                   <p className="text-sm text-gray-500">123 Adventure Way, Denver, CO 80202</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { Compass, Mail, MapPin, Phone } from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@theadventure.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (888) 424-7333",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "123 Adventure Way, Denver, CO 80202",
  },
];

export default function AboutCompany() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left — About */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
              <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
                About The Adventure Limited
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The Adventure Limited is a premier experience design company specializing in
              transformative challenges that push human limits.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our mission is to create safe, meaningful experiences that help people discover
              their untapped potential. The Isolated Challenge is our flagship program.
            </p>

            {/* Vision */}
            <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
              <Compass className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Vision:</span> Redefine human endurance
                experiences globally.
              </p>
            </div>
          </div>

          {/* Right — Contact */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-5">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
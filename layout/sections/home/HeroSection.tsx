// // // components/sections/HeroSection.tsx
// // import Link from "next/link";
// // import { ArrowRight, Clock, Award, Shield } from "lucide-react";

// // export default function HeroSection() {
// //   return (
// //     <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-white">
// //       {/* Background Pattern */}
// //       <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />

// //       <div className="container-custom relative">
// //         <div className="max-w-3xl mx-auto text-center">
// //           {/* Eyebrow */}
// //           <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-6">
// //             <span className="text-xs font-semibold text-orange-600 tracking-wide">
// //               CAN YOU HANDLE COMPLETE ISOLATION?
// //             </span>
// //           </div>

// //           {/* Headline */}
// //           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
// //             The Isolated
// //             <span className="text-orange-500"> Challenge</span>
// //           </h1>

// //           {/* Subtext */}
// //           <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
// //             Test your endurance, patience, and mental strength in total solitude — 
// //             and walk away with a life-changing reward.
// //           </p>

// //           {/* CTA Buttons */}
// //           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
// //             <button className="px-8 py-3 text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm">
// //               Apply Now
// //             </button>
// //             <button className="px-8 py-3 text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
// //               Learn More
// //             </button>
// //           </div>

// //           {/* Stats */}
// //           <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-gray-100">
// //             <div className="flex items-center gap-3">
// //               <Clock className="w-5 h-5 text-orange-500" />
// //               <span className="text-sm text-gray-600">Up to 30 days</span>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <Award className="w-5 h-5 text-orange-500" />
// //               <span className="text-sm text-gray-600">$50K Grand Prize</span>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <Shield className="w-5 h-5 text-orange-500" />
// //               <span className="text-sm text-gray-600">24/7 Medical Support</span>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// import Link from "next/link";
// import { Clock, Award, Shield } from "lucide-react";

// export default function HeroSection() {
//   return (
//     <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-white">

//       {/* Grid background */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />

//       <div className="container-custom relative">
//         <div className="max-w-3xl mx-auto text-center">

//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-6">
//             <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
//               Can You Handle Complete Isolation?
//             </span>
//           </div>

//           {/* Headline */}
//           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
//             The Isolated
//             <span className="text-orange-500"> Challenge</span>
//           </h1>

//           {/* Subtext */}
//           <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
//             Test your endurance, patience, and mental strength in total solitude —
//             and walk away with a life-changing reward.
//           </p>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//             <Link
//               href="#apply"
//               className="px-8 py-3 text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-lg shadow-sm text-center"
//             >
//               Apply Now
//             </Link>
//             <Link
//               href="#about"
//               className="px-8 py-3 text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-center"
//             >
//               Learn More
//             </Link>
//           </div>

//           {/* Stats */}
//           <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-gray-100">
//             <div className="flex items-center gap-3">
//               <Clock className="w-5 h-5 text-orange-500" />
//               <span className="text-sm text-gray-600">Up to 30 days</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <Award className="w-5 h-5 text-orange-500" />
//               <span className="text-sm text-gray-600">$50K Grand Prize</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <Shield className="w-5 h-5 text-orange-500" />
//               <span className="text-sm text-gray-600">24/7 Medical Support</span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

import Link from "next/link";
import { Clock, Award, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-white">

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-6">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              Can You Handle Complete Isolation?
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            The Adventure
            <span className="text-orange-500"> Challenge</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Test your endurance, patience, and mental strength in total solitude —
            and walk away with a life-changing reward.
          </p>

          {/* CTA Buttons */}
         <div className="flex flex-row gap-3 justify-center flex-wrap mb-12">
  <Link
  href="#apply"
  className="px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-lg shadow-sm text-center"
>
  Apply Now
</Link>

<Link
  href="#about"
  className="px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-center"
>
  Learn More
</Link>
</div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600">Up to 30+ days</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600">Life-changing Grand Prize</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600">24/7 Medical Support</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
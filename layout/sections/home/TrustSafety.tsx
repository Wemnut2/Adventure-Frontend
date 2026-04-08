// components/sections/TrustSafety.tsx
import { Shield, HeartHandshake, Eye, FileCheck } from "lucide-react";

export default function TrustSafety() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide">
              TRUST & SAFETY
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Your Wellbeing Is Our Priority
          </h2>
          <p className="text-gray-600 text-lg">
            We've designed every aspect with participant safety in mind
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 p-5 text-center">
            <div className="w-12 h-12 bg-orange-50 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">24/7 Supervision</h3>
            <p className="text-xs text-gray-500">Medical team always on standby with emergency response</p>
          </div>

          <div className="bg-white border border-gray-200 p-5 text-center">
            <div className="w-12 h-12 bg-orange-50 flex items-center justify-center mx-auto mb-3">
              <HeartHandshake className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Medical Precautions</h3>
            <p className="text-xs text-gray-500">Pre-screening + regular check-ins during isolation</p>
          </div>

          <div className="bg-white border border-gray-200 p-5 text-center">
            <div className="w-12 h-12 bg-orange-50 flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Transparent Rules</h3>
            <p className="text-xs text-gray-500">Everything disclosed before you sign</p>
          </div>

          <div className="bg-white border border-gray-200 p-5 text-center">
            <div className="w-12 h-12 bg-orange-50 flex items-center justify-center mx-auto mb-3">
              <FileCheck className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Insured & Bonded</h3>
            <p className="text-xs text-gray-500">The Adventure Limited is fully insured</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            All challenges comply with international safety standards and are overseen by licensed medical professionals.
          </p>
        </div>
      </div>
    </section>
  );
}
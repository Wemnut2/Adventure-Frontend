// components/sections/ExperiencePreview.tsx
import { Sunrise, BookOpen, Dumbbell, Moon, Eye, Ban } from "lucide-react";

const dailyRoutine = [
  { time: "7:00 AM", activity: "Wake Up", icon: Sunrise },
  { time: "8:00 AM", activity: "Breakfast (provided)", icon: BookOpen },
  { time: "10:00 AM", activity: "Physical exercise period", icon: Dumbbell },
  { time: "1:00 PM", activity: "Lunch", icon: BookOpen },
  { time: "6:00 PM", activity: "Dinner", icon: BookOpen },
  { time: "10:00 PM", activity: "Lights out", icon: Moon },
];

export default function ExperiencePreview() {
  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left - What to Expect */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
              <span className="text-xs font-semibold text-orange-600 tracking-wide">
                EXPERIENCE PREVIEW
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              What To Expect Inside
            </h2>
            <p className="text-gray-600 mb-6">
              The isolation space is comfortable but minimal — designed to eliminate distractions.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <Eye className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">The Space</p>
                  <p className="text-sm text-gray-500">A private 200 sq ft room with bed, desk, bathroom, and basic amenities. No windows to the outside.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <BookOpen className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Allowed Activities</p>
                  <p className="text-sm text-gray-500">Reading (provided books), journaling, meditation, exercise, sleeping, thinking.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Ban className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Not Allowed</p>
                  <p className="text-sm text-gray-500">Electronics, writing instruments (except journal), external contact, music.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm text-gray-600 italic">
                "The silence becomes a character of its own. You'll hear your thoughts like never before."
              </p>
              <p className="text-xs text-gray-400 mt-2">— Previous participant</p>
            </div>
          </div>

          {/* Right - Daily Routine */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Sample Daily Routine</h3>
            <div className="space-y-2">
              {dailyRoutine.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200">
                  <item.icon className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 w-20">{item.time}</span>
                  <span className="text-sm text-gray-600">{item.activity}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Psychological aspect:</span> Participants report heightened self-awareness, 
                vivid daydreaming, and a recalibrated sense of time. The first 48 hours are often the hardest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
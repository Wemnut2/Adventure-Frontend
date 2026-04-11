import { Sunrise, BookOpen, Dumbbell, Moon, Eye, Ban } from "lucide-react";

const dailyRoutine = [
  { time: "7:00 AM", activity: "Wake Up", icon: Sunrise },
  { time: "8:00 AM", activity: "Breakfast (provided)", icon: BookOpen },
  { time: "10:00 AM", activity: "Physical exercise period", icon: Dumbbell },
  { time: "1:00 PM", activity: "Lunch", icon: BookOpen },
  { time: "6:00 PM", activity: "Dinner", icon: BookOpen },
  { time: "10:00 PM", activity: "Lights out", icon: Moon },
];

const whatToExpect = [
  {
    icon: Eye,
    color: "text-orange-500",
    title: "The Space",
    body: "A private 200 sq ft room with bed, desk, bathroom, and basic amenities. No windows to the outside.",
  },
  {
    icon: BookOpen,
    color: "text-orange-500",
    title: "Allowed Activities",
    body: "Reading (provided books), journaling, meditation, exercise, sleeping, thinking.",
  },
  {
    icon: Ban,
    color: "text-red-500",
    title: "Not Allowed",
    body: "Electronics, writing instruments (except journal), external contact, music.",
  },
];

export default function ExperiencePreview() {
  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              Experience Preview
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            What To Expect Inside
          </h2>
          <p className="text-gray-500 text-lg">
            The isolation space is comfortable but minimal — designed to eliminate distractions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Left — What to expect */}
          <div>
            <div className="space-y-5 mb-8">
              {whatToExpect.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="bg-gray-50 border border-gray-200 border-l-2 border-l-orange-400 rounded-r-xl p-4">
              <p className="text-sm text-gray-600 italic leading-relaxed">
                "The silence becomes a character of its own. You'll hear your thoughts like never before."
              </p>
              <p className="text-xs text-gray-400 mt-2">— Previous participant</p>
            </div>
          </div>

          {/* Right — Daily routine */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Sample Daily Routine</h3>
            <div className="space-y-2">
              {dailyRoutine.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <item.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    {item.time}
                  </span>
                  <span className="text-sm text-gray-500">{item.activity}</span>
                </div>
              ))}
            </div>

            {/* Psychological note */}
            <div className="mt-5 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">Psychological aspect:</span> Participants
                report heightened self-awareness, vivid daydreaming, and a recalibrated sense
                of time. The first 48 hours are often the hardest.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
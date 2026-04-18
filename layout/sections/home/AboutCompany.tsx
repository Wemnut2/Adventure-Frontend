"use client";

import { Compass, Mail, MapPin, Phone, Globe } from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@theadventure.com",
    link: "mailto:hello@theadventure.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (888) 424-7333",
    link: "tel:+18884247333"
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "123 Adventure Way, Denver, CO 80202",
  },
];

export default function AboutCompany() {
  return (
    <section className="section-spacing bg-gradient-light">
      <style>{`
        .about-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          padding: 40px;
          transition: all 0.3s ease;
        }

        .about-card:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 14px;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .contact-item:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.2);
          transform: translateX(8px);
        }

        .contact-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .contact-item:hover .contact-icon {
          background: #f97316;
          border-color: #f97316;
        }

        .contact-item:hover .contact-icon svg {
          color: white;
        }

        .vision-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #fff7ed;
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 16px;
          margin-top: 32px;
        }
      `}</style>

      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - About */}
          <div className="about-card">
            <span className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-600 tracking-wide uppercase mb-6">
              About The Adventure Limited
            </span>
            
            <h2 className="font-serif text-4xl font-medium text-gray-900 mb-6 tracking-tight">
              Who We Are
            </h2>
            
            <p className="text-gray-600 leading-relaxed mb-4">
              The Adventure Limited is a premier experience design company specializing in 
              transformative challenges that push human limits.
            </p>
            
            <p className="text-gray-600 leading-relaxed mb-8">
              Our mission is to create safe, meaningful experiences that help people 
              discover their untapped potential. The Isolated Challenge is our flagship program.
            </p>

            {/* Vision */}
            <div className="vision-badge">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Compass className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                  Our Vision
                </p>
                <p className="text-sm text-gray-700">
                  Redefine human endurance experiences globally
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-orange-500">5+</p>
                <p className="text-xs text-gray-500">Years Experience</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-orange-500">100+</p>
                <p className="text-xs text-gray-500">Participants</p>
              </div>
            </div>
          </div>

          {/* Right - Contact */}
          <div className="about-card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Globe size={18} className="text-orange-500" />
              Contact Information
            </h3>
            
            <div className="space-y-3">
              {contactItems.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  className="contact-item"
                  {...(item.link ? {} : { as: 'div' })}
                >
                  <div className="contact-icon">
                    <item.icon size={18} className="text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Business Hours */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Business Hours
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="text-gray-900 font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Saturday</span>
                  <span className="text-gray-900 font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
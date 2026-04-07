import React, { useState } from "react";
import { BookOpen, Phone, Download, Newspaper, ChevronUp, ChevronDown } from "lucide-react"; // Removed unused User
import { Link } from "react-router-dom"; // Assuming you meant react-router-dom

const actions = [
  {
    icon: BookOpen,
    label: "Vizsga",
    color: "text-[#F6C90E]",
    bg: "bg-white/5 hover:bg-[#F6C90E] hover:text-black",
    href: "https://vizsgakozpont.hu",
  },
  {
    icon: Download,
    label: "Anyagok",
    color: "text-emerald-400",
    bg: "bg-white/5 hover:bg-emerald-400 hover:text-black",
    href: "https://shop.webjogsi.hu",
  },
  {
    icon: Newspaper,
    label: "Hírek",
    color: "text-red-400",
    bg: "bg-white/5 hover:bg-red-400 hover:text-black",
    href: "https://kreszvaltozas.hu/",
  },
  {
    icon: Phone,
    label: "Kapcsolat",
    color: "text-blue-400",
    bg: "bg-white/5 hover:bg-blue-400 hover:text-black",
    href: "#",
  },
];

export default function QuickActionsWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-1 flex justify-center pointer-events-none">
      {/* Mobile Collapsed State */}
      <div className="md:hidden w-full max-w-4xl pointer-events-auto">
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-full py-3 px-4 shadow-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute -left-10 bottom-0 w-32 h-60 bg-[#F6C90E] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F6C90E] animate-pulse"></span>
              <span className="text-white font-bold text-sm tracking-tight">
                Gyorsműveletek
              </span>
              <ChevronUp size={18} className="text-[#F6C90E] transition-transform duration-500 ease-out group-hover:animate-bounce" />
            </div>
          </button>
        )}

        {isExpanded && (
          <div className="w-full bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-t-4xl p-5 shadow-2xl border border-white/10 flex flex-col justify-center relative overflow-hidden group pointer-events-auto">
            <div className="absolute -left-10 bottom-0 w-32 h-60 bg-[#F6C90E] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-500" />

            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-white font-bold text-sm flex items-center gap-2 tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F6C90E]"></span>
                Gyorsműveletek
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors hover:rotate-180 duration-300"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10 duration-300">
              {actions.map((action, idx) => {
                const isInternal = action.href.startsWith("/");
                const buttonStyles = `flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 group/btn border border-white/5 no-underline hover:scale-110 ${action.bg}`;

                const content = (
                  <>
                    <action.icon
                      size={20}
                      className={`${action.color} transition-all group-hover/btn:text-inherit group-hover/btn:scale-125 group-hover/btn:rotate-12`}
                    />
                    <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-inherit uppercase tracking-wide transition-colors">
                      {action.label}
                    </span>
                  </>
                );

                return isInternal ? (
                  <Link 
                    key={idx} 
                    to={action.href} 
                    className={buttonStyles}
                    style={{
                      //animation: `fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.08}s both`
                    }}
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles}
                    style={{
                      //animation: `fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.08}s both`
                    }}
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Always Visible */}
      <div className="hidden md:flex w-full max-w-4xl pointer-events-auto">
        <div className="w-full bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-5 shadow-2xl border border-white/10 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -left-10 bottom-0 w-32 h-60 bg-[#F6C90E] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-500" />

          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F6C90E]"></span>
              Gyorsműveletek
            </h3>
          </div>

          {/* FIXED: Changed md:grid-cols-5 to md:grid-cols-4 to center the 4 items perfectly */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
            {actions.map((action, idx) => {
              const isInternal = action.href.startsWith("/");
              const buttonStyles = `flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 group/btn border border-white/5 no-underline ${action.bg}`;

              const content = (
                <>
                  <action.icon
                    size={20}
                    className={`${action.color} transition-colors group-hover/btn:text-inherit`}
                  />
                  <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-inherit uppercase tracking-wide transition-colors">
                    {action.label}
                  </span>
                </>
              );

              return isInternal ? (
                <Link key={idx} to={action.href} className={buttonStyles}>
                  {content}
                </Link>
              ) : (
                <a
                  key={idx}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles}
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

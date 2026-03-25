import React from "react";
import { BookOpen, User, Phone, Download, Newspaper } from "lucide-react";
import { Link } from "react-router"; // Fixed import

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
    icon: User,
    label: "Profil",
    color: "text-purple-400",
    bg: "bg-white/5 hover:bg-purple-400 hover:text-black",
    href: "/profile", // Internal link
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
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-1 flex justify-center pointer-events-none">
      <div className="w-full max-w-4xl bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-5 shadow-2xl border border-white/10 flex flex-col justify-center relative overflow-hidden group pointer-events-auto">
        <div className="absolute -left-10 bottom-0 w-32 h-60 bg-[#F6C90E] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-500" />

        <div className="flex justify-between items-center mb-4 relative z-10">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6C90E]"></span>
            Gyorsműveletek
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
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

            // Conditional rendering: Link for internal, <a> for external
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
                className={buttonStyles}>
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

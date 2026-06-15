"use client";

import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-10">
      <div className="max-width px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <a
            href="#hero"
            className="text-lg font-bold gradient-text"
          >
            Akash<span className="text-white">.</span>
          </a>

          <div className="flex items-center gap-4">
            {[
              { icon: FiGithub, href: "https://github.com/akashkumarprajapati", label: "GitHub" },
              { icon: FiLinkedin, href: "https://www.linkedin.com/in/akash-kumarprajapati", label: "LinkedIn" },
              { icon: FiMail, href: "mailto:akashkumarprajapati2003@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:text-accent-blue hover:border-accent-blue/50 hover:bg-accent-blue/10 transition-all duration-300"
                aria-label={label}
              >
                <Icon className="text-lg" />
              </a>
            ))}
          </div>

          <p className="text-dark-400 text-sm flex items-center gap-1">
            &copy; {new Date().getFullYear()} Made with
            <FiHeart className="text-red-500" /> by Akash Kumar Prajapati
          </p>
        </div>
      </div>
    </footer>
  );
}

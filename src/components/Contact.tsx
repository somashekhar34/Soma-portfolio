import { motion } from "framer-motion";
import { Mail, Phone, Rss } from "lucide-react";
import { profile } from "../data/resume";
import { GithubIcon, LinkedinIcon } from "./icons";

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}`, icon: Phone },
  { label: "GitHub", value: "somashekhar34", href: profile.github, icon: GithubIcon },
  { label: "LinkedIn", value: "somasekhar-addakula", href: profile.linkedin, icon: LinkedinIcon },
  { label: "Blog", value: "somashekhar34.blogspot.com", href: profile.blog, icon: Rss },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-slate-50 px-6 py-20 dark:bg-slate-900/40">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-heading">Contact</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Let's build something together
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Open to data engineering, AI platform, and analytics opportunities. Reach out any way that works for you.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {links.map(({ label, value, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="card flex items-center gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:border-accent-300 dark:hover:border-accent-500/40"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400">
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {label}
                </span>
                <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{value}</span>
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { workedFor } from "../data/resume";

function initials(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase();
}

export default function WorkedFor() {
  return (
    <section id="worked-for" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="section-heading text-center">Career Path</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Worked For
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-500 dark:text-slate-400">
          Companies and products I've contributed to across freelance, startup, and agency work.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {workedFor.map((c, i) => {
            const Wrapper = c.url ? "a" : "div";
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 2) * 0.08, duration: 0.4 }}
              >
                <Wrapper
                  {...(c.url ? { href: c.url, target: "_blank", rel: "noreferrer" } : {})}
                  className="card group flex h-full gap-4 p-6 text-left transition hover:-translate-y-0.5 hover:border-accent-300 dark:hover:border-accent-500/40"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-cyan-400 text-sm font-bold text-white">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                      {c.url && (
                        <ExternalLink
                          size={13}
                          className="flex-none text-slate-400 transition group-hover:text-accent-500"
                        />
                      )}
                    </div>
                    <p className="text-xs font-medium text-accent-600 dark:text-accent-400">{c.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {c.description}
                    </p>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

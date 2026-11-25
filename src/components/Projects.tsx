import { motion } from "framer-motion";
import { projects } from "../data/resume";

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="section-heading text-center">Selected Work</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Projects & Platforms
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-500 dark:text-slate-400">
          Production systems built across data engineering, security intelligence, and applied AI roles.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
              className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:border-accent-300 hover:shadow-lg dark:hover:border-accent-500/40"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
                {p.context}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="mt-3 flex-1 text-left text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {p.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

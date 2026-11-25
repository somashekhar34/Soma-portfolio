import { motion } from "framer-motion";
import { skillGroups } from "../data/resume";

export default function Skills() {
  return (
    <section id="skills" className="bg-slate-50 px-6 py-20 dark:bg-slate-900/40">
      <div className="mx-auto max-w-5xl">
        <p className="section-heading text-center">Toolbox</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Skills & Technologies
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 2) * 0.08, duration: 0.4 }}
              className="card p-6 text-left"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((s) => (
                  <span key={s} className="chip">
                    {s}
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

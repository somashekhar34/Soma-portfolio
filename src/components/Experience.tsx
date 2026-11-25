import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { experience } from "../data/resume";

export default function Experience() {
  return (
    <section id="experience" className="bg-slate-50 px-6 py-20 dark:bg-slate-900/40">
      <div className="mx-auto max-w-4xl">
        <p className="section-heading text-center">Experience</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Where I've built things
        </h2>

        <div className="relative mt-14 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200 sm:before:left-[15px] dark:before:bg-slate-800">
          {experience.map((job, i) => (
            <motion.div
              key={job.company + job.role}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="relative pl-9 sm:pl-12"
            >
              <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-100 text-accent-600 ring-4 ring-slate-50 sm:h-8 sm:w-8 dark:bg-accent-500/15 dark:text-accent-400 dark:ring-slate-900/40">
                <Briefcase size={14} />
              </span>

              <div className="card p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{job.role}</h3>
                  {job.period && (
                    <span className="text-xs font-medium text-accent-600 dark:text-accent-400">{job.period}</span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{job.company}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} /> {job.location}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-left text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {job.bullets.map((b, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

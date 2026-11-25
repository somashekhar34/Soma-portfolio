import { motion } from "framer-motion";
import { Award, GraduationCap, FileText } from "lucide-react";
import { certifications, education, publication } from "../data/resume";

export default function Education() {
  return (
    <section id="education" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="section-heading text-center">Background</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Education & Certifications
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-6 text-left lg:col-span-2"
          >
            <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400">
              <GraduationCap size={18} />
              <span className="text-sm font-semibold">Education</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{education.degree}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{education.school}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              {education.period} · {education.location}
            </p>
            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">GPA: {education.gpa}</p>

            <div className="mt-6 flex items-center gap-2 text-accent-600 dark:text-accent-400">
              <FileText size={18} />
              <span className="text-sm font-semibold">Publication</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{publication.title}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              {publication.venue} · {publication.date}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="card p-6 text-left lg:col-span-3"
          >
            <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400">
              <Award size={18} />
              <span className="text-sm font-semibold">Certifications</span>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {certifications.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent-400" />
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

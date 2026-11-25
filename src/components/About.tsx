import { motion } from "framer-motion";
import { profile } from "../data/resume";

export default function About() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-heading text-center"
        >
          About
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white"
        >
          Data engineering, applied where it matters
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-slate-600 dark:text-slate-400"
        >
          {profile.summary}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {profile.badges.map((b) => (
            <span key={b} className="chip">
              {b}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { ArrowDown, Mail, Sparkles } from "lucide-react";
import { profile } from "../data/resume";
import { GithubIcon, LinkedinIcon } from "./icons";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-20 pb-28 sm:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.18),transparent)]"
      />
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5 text-xs font-medium text-accent-700 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-300"
        >
          <Sparkles size={14} />
          Google Cloud Professional Data Engineer
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white"
        >
          {profile.shortName}
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-4 text-lg font-medium text-gradient sm:text-2xl"
        >
          {profile.title}
        </motion.p>

        <motion.p
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400"
        >
          Building ETL/ELT pipelines, fraud &amp; security data intelligence, and generative‑AI
          data foundations on AWS, GCP, Azure, and Snowflake, from warehouse to production voice agent.
        </motion.p>

        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="rounded-full bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-600/20 transition hover:bg-accent-700"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-accent-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-accent-400 dark:hover:text-accent-400"
          >
            Get in Touch
          </a>
        </motion.div>

        <motion.div
          custom={5}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-8 flex items-center justify-center gap-5"
        >
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
          >
            <GithubIcon size={22} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
          >
            <LinkedinIcon size={22} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
          >
            <Mail size={22} />
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-600"
        aria-label="Scroll down"
      >
        <ArrowDown size={20} className="animate-bounce" />
      </motion.a>
    </section>
  );
}

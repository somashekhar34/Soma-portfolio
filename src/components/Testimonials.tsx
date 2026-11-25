import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { testimonials } from "../data/resume";

function initials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-slate-50 px-6 py-20 dark:bg-slate-900/40">
      <div className="mx-auto max-w-5xl">
        <p className="section-heading text-center">In Their Words</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Testimonials
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-500 dark:text-slate-400">
          Video testimonials from people I've worked with are on the way. Check back soon.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.names}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
              className="card flex flex-col items-center gap-3 p-6 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-cyan-400 text-base font-bold text-white">
                {initials(t.names)}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{t.names}</h3>
                <p className="text-xs font-medium text-accent-600 dark:text-accent-400">{t.company}</p>
              </div>
              <div className="mt-2 flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-400 dark:border-slate-700 dark:text-slate-500">
                <Video size={13} />
                Video testimonial coming soon
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

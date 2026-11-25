import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import { testimonials, type Testimonial } from "../data/resume";

const CARD_STEP = 340;

function initials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="card flex w-72 flex-none flex-col items-center gap-3 p-6 text-center sm:w-80">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-cyan-400 text-base font-bold text-white">
        {initials(t.names)}
      </span>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{t.names}</h3>
        <p className="text-xs font-medium text-accent-600 dark:text-accent-400">{t.company}</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.note}</p>
      <div className="mt-2 flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-400 dark:border-slate-700 dark:text-slate-500">
        <Video size={13} />
        Video testimonial coming soon
      </div>
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let raf: number;
    const speed = 1.1;
    const step = () => {
      if (!pausedRef.current) {
        const half = el.scrollWidth / 2;
        el.scrollLeft += speed;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pauseThenResume = () => {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, 2500);
  };

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    pauseThenResume();
    el.scrollBy({ left: direction * CARD_STEP, behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="overflow-hidden bg-slate-50 py-20 dark:bg-slate-900/40">
      <div className="mx-auto max-w-5xl px-6">
        <p className="section-heading text-center">In Their Words</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Testimonials
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-500 dark:text-slate-400">
          Video testimonials from people I've worked with are on the way. Check back soon.
        </p>
      </div>

      <div className="relative mt-12">
        <button
          aria-label="Scroll left"
          onClick={() => nudge(-1)}
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-md backdrop-blur transition hover:text-accent-600 sm:flex dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          aria-label="Scroll right"
          onClick={() => nudge(1)}
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-md backdrop-blur transition hover:text-accent-600 sm:flex dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300"
        >
          <ChevronRight size={18} />
        </button>

        <div
          ref={trackRef}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          className="marquee-mask flex gap-5 overflow-x-auto px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.names} t={t} />
          ))}
          {/* Duplicate set for the seamless loop, hidden from screen readers and text selection so it doesn't read as 10 real testimonials. */}
          <div aria-hidden="true" inert className="contents">
            {testimonials.map((t) => (
              <TestimonialCard key={`${t.names}-dup`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

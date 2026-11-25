import { useState } from "react";
import { profile } from "../data/resume";

export default function Footer() {
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className="border-t border-slate-200 px-6 py-8 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row dark:text-slate-500">
        <p>© {year} {profile.name}. All rights reserved.</p>
        <p>Built with React, TypeScript & Tailwind CSS.</p>
      </div>
    </footer>
  );
}

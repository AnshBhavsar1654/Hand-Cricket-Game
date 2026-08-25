export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    localStorage.setItem("hc-theme", root.classList.contains("dark") ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="fixed top-4 right-4 z-40 p-2.5 rounded-full border border-slate-200 bg-white text-slate-500 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:text-slate-800 active:scale-90 dark:border-white/10 dark:bg-ink-800 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white"
    >
      {/* Moon shows in light mode (click for dark), sun in dark mode */}
      <svg className="w-4 h-4 block dark:hidden" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg className="w-4 h-4 hidden dark:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}

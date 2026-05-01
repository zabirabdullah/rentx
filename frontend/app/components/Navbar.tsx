export function Navbar() {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg docked full-width top-0 sticky z-50 border-b border-slate-200/50 dark:border-slate-800/50 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto font-['Inter'] antialiased tracking-tight">
        <div className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white">Rent<span className="text-emerald-800">X</span></div>
        <nav className="hidden md:flex items-center space-gap gap-8">
          <a className="text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 pb-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300" href="#">Explore</a>
          <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300" href="#">Locations</a>
          <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300" href="#">Services</a>
          <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300" href="#">About</a>
        </nav>
        <div className="flex items-center gap-6">
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold active:scale-95 transition-transform shadow-lg shadow-primary/20">Login</button>
        </div>
      </div>
    </header>
  );
}

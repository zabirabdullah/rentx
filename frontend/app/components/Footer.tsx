export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 full-width rounded-none border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 max-w-7xl mx-auto font-['Inter'] text-sm tracking-wide">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <div className="text-xl font-black text-slate-900 dark:text-white mb-2">RentX</div>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            Premium residential rentals in Dhaka's most sought-after neighborhoods. Experience the new standard of living.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-12 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-widest mb-2">Company</p>
            <a className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 underline transition-all" href="#">About</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 underline transition-all" href="#">Careers</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 underline transition-all" href="#">Contact</a>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-widest mb-2">Legal</p>
            <a className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 underline transition-all" href="#">Privacy Policy</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 underline transition-all" href="#">Terms of Service</a>
          </div>
        </div>
        <div className="mt-12 md:mt-0 flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer" data-icon="facebook">social_leaderboard</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer" data-icon="instagram">retweet</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer" data-icon="linkedin">link</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-4">© 2024 RentX Luxury Living. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

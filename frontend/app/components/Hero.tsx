export function Hero() {
  return (
    <section className="relative h-[870px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img className="w-full h-full object-cover" alt="Hero background view of Dhaka" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF9wju5LHBMYFf_G0Lv0Kpw-SDDM1gf3O-B7W0-QN80O5dzBkrAgRTOM9OFzGE4_G4pm6JJngkNfj3I5ktgRboVGt5uBkn2iK93Dl0ciTG7khniJIc8pUdmXVtcESQjzaWFHjvylcjx21D1jdWtCk5-nnrd5zy8AqwgAMtsFLElqgTRVfnmcuitJh4yESuYJjNK9NLcyplOhTdFoK3dt_1cpR4CaKaX_-IGci_JR8yvgCeynMUGs1GNvD8dWtkNRtVu_Nbs-bxu-k"/>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      <div className="relative z-10 w-full max-w-5xl px-6">
        <div className="text-center mb-12">
          <h1 className="font-display text-display text-white mb-4 drop-shadow-md">Luxury Living, Simplified.</h1>
          <p className="font-body-lg text-white/90 max-w-2xl mx-auto">Discover Dhaka's most exclusive residences in curated neighborhoods.</p>
        </div>

        {/* Soft UI Search Bar */}
        <div className="glass-panel p-4 rounded-3xl shadow-2xl max-w-4xl mx-auto border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="px-4 py-2 border-r border-slate-200 last:border-0 rounded-2xl transition-all duration-200 focus-within:bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Area/Thana</label>
              <div className="group flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-xl transition-all duration-200 group-focus-within:text-primary" data-icon="location_on">location_on</span>
                <input className="w-full bg-transparent border-0 p-0 outline-none focus:outline-none focus:ring-0 text-slate-900 font-medium placeholder:text-slate-400 transition-all duration-200" placeholder="Gulshan, Dhaka" type="text"/>
              </div>
            </div>
            <div className="px-4 py-2 border-r border-slate-200 last:border-0 rounded-2xl transition-all duration-200 focus-within:bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Flat Type</label>
              <div className="group flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-xl transition-all duration-200 group-focus-within:text-primary" data-icon="apartment">apartment</span>
                <select className="w-full bg-transparent border-0 p-0 outline-none focus:outline-none focus:ring-0 text-slate-900 font-medium appearance-none transition-all duration-200">
                  <option>3 BHK Luxury</option>
                  <option>Penthouse</option>
                  <option>Studio</option>
                  <option>Duplex</option>
                </select>
              </div>
            </div>
            <div className="px-4 py-2 border-r border-slate-200 last:border-0 rounded-2xl transition-all duration-200 focus-within:bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Price Range</label>
              <div className="group flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-xl transition-all duration-200 group-focus-within:text-primary" data-icon="payments">payments</span>
                <input className="w-full bg-transparent border-0 p-0 outline-none focus:outline-none focus:ring-0 text-slate-900 font-medium placeholder:text-slate-400 transition-all duration-200" placeholder="৳50k - ৳250k" type="text"/>
              </div>
            </div>
            <div className="flex items-center justify-center p-2">
              <button className="w-full h-full bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined" data-icon="search">search</span>
                Find Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

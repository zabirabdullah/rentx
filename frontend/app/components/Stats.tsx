export function Stats() {
  return (
    <section className="bg-surface-container py-24 mb-section-padding">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-4xl font-black text-primary mb-2">1,200+</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Verified Flats</p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary mb-2">15k+</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Happy Renters</p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary mb-2">0%</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Commission Fee</p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary mb-2">24h</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Support Time</p>
          </div>
        </div>
      </div>
    </section>
  );
}

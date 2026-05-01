export function CuratedCollections() {
  return (
    <section className="py-section-padding px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2">
            Curated Collections
          </h2>
          <p className="text-on-surface-variant font-body-md">
            Hand-picked luxury properties in prime Dhaka locations.
          </p>
        </div>
        <button className="flex items-center gap-2 text-primary font-bold hover:underline">
          View All Locations
          <span className="material-symbols-outlined" data-icon="arrow_forward">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
        <div className="md:col-span-8 bg-white rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 group">
          <div className="relative h-[450px]">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Penthouse view"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZSQfN1kQfbnz58cW6_AWtaxGvWizOPm_euRVzUur7gS0GfOELWRw6U-Yf27y-OwnWT1RxRIyuo1lknWrdOQTtPlk2tlL1hRQhtGy6ZJWXYdDxiOXcfeV3RhPqthWWiKwBSjhB86Sm8Uhqr5-ux_4-yKVls3pDkqMpuQSVayy0AdOLDPNrMHoEEqjtpWjdFxezM15kkgqcGz8zzrsbA68OdV51bsdsGRxn29iYc8F5HDXWUj6dEZ9dnzxn7auMWzLVu_QmefNBo4k"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                Featured
              </span>
              <span className="bg-white/90 text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px] text-primary"
                  data-icon="verified"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                Verified Owner
              </span>
            </div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-sm font-bold tracking-widest uppercase mb-2 text-emerald-400">
                Gulshan 2, North Avenue
              </p>
              <h3 className="text-3xl font-bold mb-4">The Zenith Penthouse</h3>
              <div className="flex items-center gap-6 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined"
                    data-icon="straighten"
                  >
                    straighten
                  </span>{" "}
                  4,200 sqft
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined" data-icon="bed">
                    bed
                  </span>{" "}
                  4 Beds
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined"
                    data-icon="bathtub"
                  >
                    bathtub
                  </span>{" "}
                  5 Baths
                </span>
              </div>
            </div>
            <div className="absolute bottom-8 right-8">
              <div className="bg-white px-6 py-3 rounded-2xl shadow-xl">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                  Monthly Rent
                </p>
                <p className="text-xl font-black text-slate-900">৳240,000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 group">
          <div className="relative h-[250px]">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Dhanmondi apartment"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3f6GlgrcIQGBCSYszL5wJE5ktXof4kVlsq1wvFlxAM3oHPZ5Q_gXb6iPC3qtTj37O6w6NF_wTnKMy6goCJgQo4feeV5OjMzvotb1-Zs6fIvbwpKmo_6F2mPbZhQBigwfEeQocdpODSVsvi6SnnO92OMzcRF1z3XHEc2iaPFHKtzmNPQSC1xqzTxzuRfzwbx6j0Pf0uPiJYCQItp20HoS1r6bz4ZAK1F_LLg9nzjTG3eewHCeaZVXTjYv_8W__GkayAScFcBvshwQ"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute top-4 right-4 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[14px] text-primary"
                data-icon="check_circle"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Verified
            </span>
          </div>
          <div className="p-6">
            <p className="text-xs font-bold text-emerald-600 mb-1">
              Dhanmondi 27
            </p>
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              Lakeside Modernist Unit
            </h4>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-black text-slate-900">৳115,000</p>
                <p className="text-xs text-slate-500">2,150 sqft • 3 Bed</p>
              </div>
              <button className="bg-slate-50 p-3 rounded-xl hover:bg-primary/10 transition-colors group/btn">
                <span
                  className="material-symbols-outlined text-slate-600 group-hover/btn:text-primary"
                  data-icon="chevron_right"
                >
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 group">
          <div className="relative h-[250px]">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Banani apartment"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1CnRHHNTrsAFfL7_QteYZohG6QJmAMDz0_DBLhrAKv7gUYj1hAJxBvr84OnCMeujhCTsL1EnHZoD9ms-I18mU1puDM2oKw-xfxb7KZY6OgV-ude2MgHOxJXy36c4QnMK0-25eugqMQUz8PQg80kXTxfO6J9j8QWw9RK_8IkcgT0IjfRepxVVbmvEYg5DZC8RPV8POxswc0VX8xe0ia8OdFsQ7LXZifUIT3ujkp8EUwWDBgM3ycwd4aJebZxan_zDmkkkJS7VqBdI"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute top-4 right-4 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[14px] text-primary"
                data-icon="check_circle"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Verified
            </span>
          </div>
          <div className="p-6">
            <p className="text-xs font-bold text-emerald-600 mb-1">
              Banani Block H
            </p>
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              The Terrace Executive
            </h4>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-black text-slate-900">৳165,000</p>
                <p className="text-xs text-slate-500">2,800 sqft • 4 Bed</p>
              </div>
              <button className="bg-slate-50 p-3 rounded-xl hover:bg-primary/10 transition-colors group/btn">
                <span
                  className="material-symbols-outlined text-slate-600 group-hover/btn:text-primary"
                  data-icon="chevron_right"
                >
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-emerald-900 rounded-xl overflow-hidden shadow-xl p-8 flex flex-col justify-between text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span
              className="material-symbols-outlined text-8xl"
              data-icon="house_with_shield"
            >
              house_with_shield
            </span>
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-4">Concierge Service</h4>
            <p className="text-white/70 font-body-md mb-6 leading-relaxed">
              Let our luxury advisors find the perfect home for you. Personal
              tours, legal vetting, and relocation support.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <span
                  className="material-symbols-outlined text-emerald-400 text-lg"
                  data-icon="done_all"
                >
                  done_all
                </span>
                Priority property access
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span
                  className="material-symbols-outlined text-emerald-400 text-lg"
                  data-icon="done_all"
                >
                  done_all
                </span>
                Legal verification support
              </li>
            </ul>
          </div>
          <button className="bg-white text-emerald-900 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors mt-8">
            Talk to an Agent
          </button>
        </div>

        <div className="md:col-span-4 bg-white rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 group">
          <div className="relative h-[250px]">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Baridhara villa"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBduh4YIXNE82_qZihm0HbAc5EKvvQQTT2nQoYxq6TOtjMhJ09VHCaBNVFb8uxjssAmb74mVbzsVKS8kuFeHPWNkJudgb_3FWxOcSPlG5D8tbGOJAyIOdxqYpuu2kV8-GgWQEVdTpaggUymXgFqVmqWzYqEA04c406XD00AXVhGYpsVy03SpiDlyL1Nzn5M72j__L8sljK3TL-o4McCZ0_L1hqp6SntO86D05OT2UY5MCcJsiw2_d5TFabj_CP-MbZoDAMakAhunM"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute top-4 right-4 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[14px] text-primary"
                data-icon="check_circle"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Verified
            </span>
          </div>
          <div className="p-6">
            <p className="text-xs font-bold text-emerald-600 mb-1">
              Baridhara K-Block
            </p>
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              Diplomatic Enclave Villa
            </h4>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-black text-slate-900">৳350,000</p>
                <p className="text-xs text-slate-500">5,500 sqft • 5 Bed</p>
              </div>
              <button className="bg-slate-50 p-3 rounded-xl hover:bg-primary/10 transition-colors group/btn">
                <span
                  className="material-symbols-outlined text-slate-600 group-hover/btn:text-primary"
                  data-icon="chevron_right"
                >
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

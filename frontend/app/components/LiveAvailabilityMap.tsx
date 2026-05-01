import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const dummyProperties = [
  {
    id: 1,
    title: "The Zenith Penthouse",
    price: "240k",
    position: [23.7925, 90.4078] as [number, number],
    beds: 4,
    baths: 5,
    sqft: 4200,
    location: "Gulshan 2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZSQfN1kQfbnz58cW6_AWtaxGvWizOPm_euRVzUur7gS0GfOELWRw6U-Yf27y-OwnWT1RxRIyuo1lknWrdOQTtPlk2tlL1hRQhtGy6ZJWXYdDxiOXcfeV3RhPqthWWiKwBSjhB86Sm8Uhqr5-ux_4-yKVls3pDkqMpuQSVayy0AdOLDPNrMHoEEqjtpWjdFxezM15kkgqcGz8zzrsbA68OdV51bsdsGRxn29iYc8F5HDXWUj6dEZ9dnzxn7auMWzLVu_QmefNBo4k",
  },
  {
    id: 2,
    title: "Lakeside Modernist Unit",
    price: "115k",
    position: [23.7461, 90.3742] as [number, number],
    beds: 3,
    baths: 3,
    sqft: 2150,
    location: "Dhanmondi 27",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3f6GlgrcIQGBCSYszL5wJE5ktXof4kVlsq1wvFlxAM3oHPZ5Q_gXb6iPC3qtTj37O6w6NF_wTnKMy6goCJgQo4feeV5OjMzvotb1-Zs6fIvbwpKmo_6F2mPbZhQBigwfEeQocdpODSVsvi6SnnO92OMzcRF1z3XHEc2iaPFHKtzmNPQSC1xqzTxzuRfzwbx6j0Pf0uPiJYCQItp20HoS1r6bz4ZAK1F_LLg9nzjTG3eewHCeaZVXTjYv_8W__GkayAScFcBvshwQ",
  },
  {
    id: 3,
    title: "The Terrace Executive",
    price: "165k",
    position: [23.794, 90.4] as [number, number],
    beds: 4,
    baths: 4,
    sqft: 2800,
    location: "Banani Block H",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1CnRHHNTrsAFfL7_QteYZohG6QJmAMDz0_DBLhrAKv7gUYj1hAJxBvr84OnCMeujhCTsL1EnHZoD9ms-I18mU1puDM2oKw-xfxb7KZY6OgV-ude2MgHOxJXy36c4QnMK0-25eugqMQUz8PQg80kXTxfO6J9j8QWw9RK_8IkcgT0IjfRepxVVbmvEYg5DZC8RPV8POxswc0VX8xe0ia8OdFsQ7LXZifUIT3ujkp8EUwWDBgM3ycwd4aJebZxan_zDmkkkJS7VqBdI",
  },
  {
    id: 4,
    title: "Diplomatic Enclave Villa",
    price: "350k",
    position: [23.8005, 90.415] as [number, number],
    beds: 5,
    baths: 5,
    sqft: 5500,
    location: "Baridhara",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBduh4YIXNE82_qZihm0HbAc5EKvvQQTT2nQoYxq6TOtjMhJ09VHCaBNVFb8uxjssAmb74mVbzsVKS8kuFeHPWNkJudgb_3FWxOcSPlG5D8tbGOJAyIOdxqYpuu2kV8-GgWQEVdTpaggUymXgFqVmqWzYqEA04c406XD00AXVhGYpsVy03SpiDlyL1Nzn5M72j__L8sljK3TL-o4McCZ0_L1hqp6SntO86D05OT2UY5MCcJsiw2_d5TFabj_CP-MbZoDAMakAhunM",
  },
];

export function LiveAvailabilityMap() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeProperty, setActiveProperty] = useState<
    (typeof dummyProperties)[0] | null
  >(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const createPriceIcon = (price: string) => {
    if (typeof window === "undefined") return undefined as any;
    return L.divIcon({
      className: "bg-transparent border-0 shadow-none", // Override default Leaflet styling
      html: `<div class="bg-white rounded-full border border-emerald-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)] px-3 py-1.5 text-sm font-bold text-slate-900 whitespace-nowrap flex items-center justify-center transition-transform hover:scale-110 cursor-pointer">
              ৳${price}
            </div>`,
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });
  };

  return (
    <section className="py-section-padding px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2">
            Live Availability Map
          </h2>
          <p className="text-on-surface-variant font-body-md">
            Explore available properties interactively across Dhaka.
          </p>
        </div>
      </div>

      <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-slate-100">
        {!isMounted ? (
          <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
            Loading Map...
          </div>
        ) : (
          <MapContainer
            center={[23.774, 90.395]}
            zoom={12}
            scrollWheelZoom={false}
            className="w-full h-full z-0" // z-0 so it doesn't overlap higher z-index UI elements
          >
            {/* Minimalist Silver Theme from CartoDB */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {dummyProperties.map((property) => (
              <Marker
                key={property.id}
                position={property.position}
                icon={createPriceIcon(property.price)}
                eventHandlers={{
                  click: () => setActiveProperty(property),
                }}
              />
            ))}
          </MapContainer>
        )}

        {/* Glassmorphism Active State Card Overlay */}
        {activeProperty && isMounted && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/50 z-10 transition-all animate-in fade-in slide-in-from-bottom-4">
            <button
              onClick={() => setActiveProperty(null)}
              className="absolute top-3 right-3 bg-slate-100/80 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                close
              </span>
            </button>
            <div className="flex gap-4 items-center">
              <img
                src={activeProperty.image}
                alt={activeProperty.title}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
                  {activeProperty.location}
                </p>
                <h4 className="font-bold text-slate-900 text-sm mb-1 leading-tight">
                  {activeProperty.title}
                </h4>
                <p className="text-xs text-slate-500">
                  {activeProperty.beds} Bed • {activeProperty.baths} Bath
                </p>
                <p className="text-sm font-black text-slate-900 mt-1">
                  ৳{activeProperty.price}
                </p>
              </div>
            </div>
            <button className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
              View Details
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

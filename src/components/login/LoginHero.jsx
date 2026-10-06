import { Truck, ShieldCheck, MapPin } from 'lucide-react';

export default function LoginHero() {
  return (
    <div className="hidden lg:flex w-1/2 relative bg-primary flex-col justify-center items-center p-12 overflow-hidden">
      
      {/* 1. Background Image with subtle zoom effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=2000&auto=format&fit=crop')" }}
      ></div>
      
      {/* 2. Brand Color Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-linear-to-br from-primary/95 to-primary/70"></div>
      
      {/* 3. Glassmorphism Content Card */}
      <div className="relative z-10 w-full max-w-lg p-10 rounded-4xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl text-slate-50">
        
        <div className="flex justify-center mb-8">
          <div className="p-5 bg-secondary rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 cursor-pointer">
            <Truck size={48} className="text-stone-500" strokeWidth={1.5} />
          </div>
        </div>
        
        <h2 className="text-4xl font-extrabold mb-4 text-center tracking-tight">
          Clezo Express Laundry
        </h2>
        <p className="text-lg text-slate-100 text-center mb-10 leading-relaxed font-light">
          Enterprise Logistics Management. Streamline your workflow, track fleets, and scale your business securely.
        </p>

        {/* Info Pills */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <ShieldCheck className="text-secondary" size={24} />
            <span className="text-sm font-semibold tracking-wide">Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <MapPin className="text-secondary" size={24} />
            <span className="text-sm font-semibold tracking-wide">Pan-India Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}
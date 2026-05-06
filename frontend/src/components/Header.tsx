import { Sprout } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <div className="bg-brand-500 p-2 rounded-xl text-white shadow-md shadow-brand-500/20">
          <Sprout size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Farm<span className="text-brand-600">Foresight</span>
        </h1>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-brand-600 transition-colors">How it works</a>
        <a href="#" className="hover:text-brand-600 transition-colors">Resources</a>
        <a href="#" className="hover:text-brand-600 transition-colors">Contact</a>
      </nav>
    </header>
  );
}

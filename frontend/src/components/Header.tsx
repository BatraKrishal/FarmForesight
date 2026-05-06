import { Sprout } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between z-10">
      <Link href="/" className="flex items-center gap-3">
        <div className="bg-brand-500 p-2 rounded-xl text-white shadow-md shadow-brand-500/20">
          <Sprout size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Farm<span className="text-brand-600">Foresight</span>
        </h1>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <Link href="/chatbot" className="hover:text-brand-600 transition-colors flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          AI Assistant
        </Link>
        <a href="#" className="hover:text-brand-600 transition-colors">How it works</a>
        <a href="#" className="hover:text-brand-600 transition-colors">Resources</a>
      </nav>
    </header>
  );
}

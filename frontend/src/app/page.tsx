import Link from "next/link";

export default function Home() {
  return (

    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc]">
      <div className="relative z-10 flex flex-col items-center gap-5 text-center px-6 py-12 bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl max-w-2xl mx-4">
        <header className="flex flex-col items-center">
          <span className="text-indigo-600 font-semibold tracking-widest uppercase text-sm mb-2">
            Welcome To
          </span>
          <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tight">
            Listing<span className="text-indigo-600">.</span>
          </h1>
        </header>

        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-md">
          Organize Your Day, Your Way.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-200"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/80 text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-white transition-all duration-200"
          >
            Log In
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          To-Do List App &copy; 2026
        </p>
      </div>
    </main>
  );
}

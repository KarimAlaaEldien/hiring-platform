import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Navbar from "@/components/Navbar";
import { Bookmark } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#E0DDD8_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="flex-1 flex items-center container max-w-[1128px] mx-auto px-4 relative z-10 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
          
          <div className="flex flex-col">
            <h1 className="text-[40px] md:text-[52px] font-bold text-black leading-[1.1] mb-4">
              Find your next opportunity
            </h1>
            
            <p className="text-text-muted text-[18px] mb-8 max-w-md">
              Connect with companies and developers on the most professional platform. Discover jobs that match your skills.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/jobs">
                <Button size="lg" className="w-full sm:w-auto h-[56px] text-[18px] px-8 rounded-full shadow-sm hover:shadow-md">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-[56px] text-[18px] px-8 rounded-full">
                  Sign In
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-text-muted font-medium tracking-wide">
              500+ Developers &nbsp;&middot;&nbsp; 120+ Companies &nbsp;&middot;&nbsp; 1000+ Jobs Posted
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-center w-full relative">
            
            {/* Second peek card */}
            <div className="w-[440px] bg-bg-surface rounded-xl p-6 shadow-sm border border-border absolute -bottom-8 z-0 opacity-50 scale-95 blur-[1px]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-accent-main rounded-full flex items-center justify-center font-bold text-xl text-white">
                    G
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black mb-1">Full Stack Engineer</h2>
                    <p className="text-accent-main font-medium text-sm">Google</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="w-[480px] bg-bg-surface rounded-xl p-6 shadow-[0_12px_24px_rgba(0,0,0,0.12)] border border-border relative z-10 bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-accent-main rounded-full flex items-center justify-center font-bold text-xl text-white">
                    MS
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black mb-1">Senior Frontend Engineer</h2>
                    <p className="text-accent-main font-medium text-sm hover:underline cursor-pointer">Microsoft</p>
                    <p className="text-text-muted text-sm mt-0.5">Redmond, WA (Hybrid)</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Save Senior Frontend Engineer"
                  className="p-2 text-text-muted hover:bg-gray-100 rounded-full transition-colors pointer-events-none"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6 mt-4">
                <span className="px-3 py-1 rounded-full bg-accent-light text-accent-main text-xs font-semibold">
                  React
                </span>
                <span className="px-3 py-1 rounded-full bg-accent-light text-accent-main text-xs font-semibold">
                  TypeScript
                </span>
                <span className="px-3 py-1 rounded-full bg-accent-light text-accent-main text-xs font-semibold">
                  $140k - $200k
                </span>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-text-muted">Posted 2 hours ago</p>
                <Button variant="primary" size="sm" className="h-8 text-sm px-4 pointer-events-none">
                  Easy Apply
                </Button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}

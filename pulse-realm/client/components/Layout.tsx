import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, BarChart3, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">Waffo</h1>
                <p className="text-xs text-slate-400">Stablecoin Exception Handler</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors text-sm sm:text-base font-medium"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Exceptions</span>
              </Link>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors text-sm sm:text-base font-medium">
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Waffo</h3>
              <p className="text-slate-400 text-sm">
                Professional stablecoin payment exception management platform
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Real-time Monitoring</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Error Analytics</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Bulk Operations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2024 Waffo. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm mt-4 sm:mt-0">
              Secure stablecoin payment exception handling
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

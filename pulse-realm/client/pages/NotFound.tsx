import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-20 h-20 text-slate-500 opacity-50" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-2">Page Not Found</p>
          <p className="text-slate-400 mb-8">
            The page you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

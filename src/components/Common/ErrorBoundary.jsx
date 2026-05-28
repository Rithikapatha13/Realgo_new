import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 my-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Something went wrong</h2>
          <p className="text-slate-500 text-xs text-center mt-2 max-w-md leading-relaxed">
            An error occurred while loading this section of the dashboard. This might be due to a network glitch or data mismatch.
          </p>
          {this.state.error && (
            <div className="mt-4 w-full bg-slate-50 border border-slate-100 rounded-xl p-3 max-h-24 overflow-auto">
              <code className="text-[10px] text-slate-500 font-mono block break-all">
                {this.state.error.toString()}
              </code>
            </div>
          )}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <RefreshCw size={14} />
              Reload Page
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-black transition-all active:scale-95"
            >
              <Home size={14} />
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

"use client";
import { useState } from "react";

export default function SimulationPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSchedule = async () => {
    setLoading(true);
    setMessage("Running AI Scheduling Algorithm...");
    try {
      const res = await fetch("/api/schedule", { method: "POST" });
      const data = await res.json();
      setMessage(`Success: ${data.count || 0} cases scheduled!`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage("Failed to run scheduler.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure? This will clear all hearings.")) return;
    setLoading(true);
    setMessage("Resetting system...");
    try {
      await fetch("/api/reset-schedule", { method: "POST" });
      setMessage("System Reset Done!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMessage("Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border p-6 rounded shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Simulation Control Room</h2>
          <p className="text-sm text-gray-500">Manage AI re-distribution and system state.</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>}
            Reset All
          </button>
          
          <button
            onClick={handleSchedule}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {loading ? "Processing..." : "Run Auto-Scheduler"}
          </button>
        </div>
      </div>

      {message && (
        <div className="mt-4 p-2 bg-blue-50 text-blue-700 text-sm rounded border border-blue-100 text-center font-medium animate-pulse">
          {message}
        </div>
      )}
    </div>
  );
}
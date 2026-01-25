'use client';
import { useState } from 'react';
import JudgeTimeline from '../components/JudgeTimeline';



export default function SchedulePage() {
  const [loading, setLoading] = useState(false);

  const handleRebalance = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedule', { method: 'POST' });
      const data = await res.json();
      
      alert(`Rebalancing complete! ${data.count} cases scheduled.`);
      window.location.reload();
    } catch (error) {
      alert("Failed to rebalance");
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hearing Schedule Timeline</h1>
        
        <button 
          onClick={handleRebalance}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Rebalancing..." : "🔄 Auto-Rebalance"}
        </button>
      </div>
      
      <JudgeTimeline />
    </div>
  );
}
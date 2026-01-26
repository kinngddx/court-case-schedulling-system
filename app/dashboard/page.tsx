import Analytics from '../components/Analytics';
import SimulationPanel from '../components/Simulationpanel';
import JudgeWorkload from '../components/JudgeWorkload';
import JudgeTimeline from '../components/JudgeTimeline'; 

export default function Dashboard() {

  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Command Center</h1>
          <p className="text-sm text-slate-500">Real-time case prioritization and judge allocation</p>
        </div>
      </div>

     
      <section>
        <Analytics />
      </section>

    
      <section>
        <SimulationPanel />
      </section>

      {/* 4. Visualizations */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded border shadow-sm min-h-[300px]">
          <h2 className="text-lg font-bold mb-4 text-slate-700">Judge Resource Allocation</h2>
          <JudgeWorkload />
        </div>

        <div className="bg-white p-6 rounded border shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold mb-4 text-slate-700">Hearing Timeline (Next 5 Days)</h2>
          
          <JudgeTimeline />
        </div>
      </div>
    </div>
  );
}
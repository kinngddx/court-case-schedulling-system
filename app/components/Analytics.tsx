"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Analytics() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-slate-500">Calculating stats...</div>;

  // 1. Basic Stats Calculation
  const total = cases.length;
  const pending = cases.filter((c) => c.status === "Pending").length;
  const scheduled = cases.filter((c) => c.status === "Scheduled").length;
  const avgPriority = total > 0 
    ? (cases.reduce((sum, c) => sum + c.priorityScore, 0) / total).toFixed(1) 
    : 0;

 


  const typeData = [
    { name: "Criminal", value: cases.filter((c) => c.caseType === "Criminal").length },
    { name: "Civil", value: cases.filter((c) => c.caseType === "Civil").length },
    { name: "Family", value: cases.filter((c) => c.caseType === "Family").length },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
     

     {/* //stats grid hai */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Cases" value={total} color="text-blue-600" />
        <StatCard title="Pending" value={pending} color="text-amber-600" />
        <StatCard title="Scheduled" value={scheduled} color="text-emerald-600" />
<StatCard title="Avg Priority" value={`${avgPriority}%`} color="text-rose-600" />      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border shadow-sm">
  


  {/* pie charts yaha se */}
        <div className="h-64">
          <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">Case Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      
        <div className="flex flex-col justify-center space-y-2">
          <h3 className="text-sm font-bold text-slate-500 uppercase">System Efficiency</h3>
          <p className="text-xs text-slate-500">
            Current priority scoring is driven by the AI model.
            The system prioritizes <span className="font-bold text-slate-700">Criminal</span> cases 
            with higher severity and older filing dates.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${(scheduled/total)*100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 text-right">{Math.round((scheduled/total)*100)}% Clearance Rate</p>
        </div>
      </div>
    </div>
  );
}




function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <p className="text-xs font-bold text-slate-500 uppercase">{title}</p>
      <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Gavel, Scale, Users, AlertCircle } from "lucide-react";

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        setCases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getPriorityStyles = (score: number) => {
    if (score > 70) return "bg-red-100 text-red-700 border-red-200";
    if (score > 40) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Criminal": return <Gavel size={14} />;
      case "Civil": return <Scale size={14} />;
      case "Family": return <Users size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Fetching cases...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">All Court Cases</h1>
        <p className="text-sm text-slate-500">{cases.length} Total Records</p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-600 text-xs uppercase font-bold">
              <th className="p-4">Case Number</th>
              <th className="p-4">Type</th>
              <th className="p-4">Priority Score</th>
              <th className="p-4">Status</th>
              <th className="p-4">Filed Date</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-medium text-blue-600">{c.caseNumber}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getIcon(c.caseType)}
                    {c.caseType}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityStyles(c.priorityScore)}`}>
                    {c.priorityScore}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${c.status === 'Scheduled' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500">
                  {format(new Date(c.filedDate), "MMM dd, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cases.length === 0 && (
          <div className="p-10 text-center text-slate-400">No cases found in database.</div>
        )}
      </div>
    </div>
  );
}
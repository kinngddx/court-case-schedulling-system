"use client";
import { useEffect, useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Gavel, Calendar, User, Clock } from "lucide-react";

export default function JudgeTimeline() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  const next5Days = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));

  // 
  



//cahnges hue hai
  useEffect(() => {
  fetch("/api/hearings")
    .then((res) => res.json())
    .then((json) => {
      setData(Array.isArray(json) ? json : []);  
      setLoading(false);
    })
    .catch(() => {
      setData([]);
      setLoading(false);
    });
}, []);





  if (loading) return <div className="p-4">Loading Timeline...</div>;

  // Grouping Logic: Get unique judges from the hearings
  const judges = Array.from(new Set(data.map((h) => h.judge.id))).map((id) => {
    return data.find((h) => h.judge.id === id).judge;
  });



//   // Fetch all judges instead yeh kiye hai to get all the judges bc
// const [allJudges, setAllJudges] = useState<any[]>([]);

// useEffect(() => {
//   fetch("/api/judges")
//     .then(res => res.json())
//     .then(setAllJudges);
// }, []);

// const judges = allJudges;




  const handleLeave = async (judgeId: string) => {
  if (!confirm("Mark this judge on leave? All cases will be unscheduled.")) return;
  
  try {
    const res = await fetch(`/api/judges/${judgeId}/leave`, {
      method: 'POST'
    });
    
    if (res.ok) {
      alert("Judge marked on leave. Refresh to see changes.");
      window.location.reload();
    }
  } catch (error) {
    alert("Failed to process leave");
  }
};



  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-6 bg-slate-50 border-b">
        <div className="p-4 border-r font-bold text-slate-600 flex items-center gap-2">
          <User size={18} /> Judge
        </div>
        {next5Days.map((day) => (
          <div key={day.toString()} className="p-4 text-center border-r last:border-0">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              {format(day, "EEE")}
            </p>
            <p className="text-sm font-bold text-slate-800">{format(day, "MMM dd")}</p>
          </div>
        ))}
      </div>

      {judges.map((judge) => (
        <div key={judge.id} className="grid grid-cols-6 border-b last:border-0 hover:bg-slate-50 transition">
          <div className="p-4 border-r bg-slate-50/30">
  <p className="font-semibold text-slate-900">{judge.name}</p>
  <p className="text-xs text-slate-500">{judge.expertise.join(", ")}</p>
  
  <button 
    onClick={() => handleLeave(judge.id)}
    className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
  >
    Mark Leave
  </button>
</div>

          {next5Days.map((day) => {
            // Find if this judge has a hearing on this specific day
            const dayHearing = data.find(
              (h) => h.judgeId === judge.id && isSameDay(new Date(h.scheduledDate), day)
            );

            return (
              <div key={day.toString()} className="p-2 border-r last:border-0 flex items-center justify-center">
                {dayHearing ? (
                  <div className="group relative w-full bg-blue-50 border border-blue-200 p-2 rounded-lg text-blue-700 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                    <div className="flex items-center gap-1 font-bold text-[10px]">
                      <Gavel size={12} /> {dayHearing.case.caseNumber}
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute hidden group-hover:block z-10 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg -top-10 left-0 w-32">
                      {dayHearing.case.description}
                    </div>
                  </div>
                ) : (
                  <div className="h-2 w-2 bg-slate-100 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
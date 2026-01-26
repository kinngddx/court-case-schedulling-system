"use client";
import { useEffect, useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Gavel, User } from "lucide-react";

export default function JudgeTimeline() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const next5Days = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));

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

  const judges = Array.from(new Set(data.map((h) => h.judge.id))).map((id) => {
    return data.find((h) => h.judge.id === id).judge;
  });

  const handleLeave = async (judgeId: string) => {
    if (!confirm("Mark this judge on leave? All cases will be unscheduled.")) return;

    try {
      const res = await fetch(`/api/judges/${judgeId}/leave`, {
        method: "POST",
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
            const dayHearings = data.filter(
              (h) => h.judgeId === judge.id && isSameDay(new Date(h.scheduledDate), day)
            );

            return (
              <div key={day.toString()} className="p-2 border-r last:border-0 flex flex-col gap-1">
                {dayHearings.length > 0 ? (
                  dayHearings.map((hearing) => (
                    <div
                      key={hearing.id}
                      className="group relative w-full bg-blue-50 border border-blue-200 p-1 rounded text-blue-700 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-[9px]">
                        <Gavel size={10} /> {hearing.case.caseNumber}
                      </div>
                      <div className="absolute hidden group-hover:block z-10 bg-slate-800 text-white text-[9px] p-2 rounded shadow-lg -top-10 left-0 w-32">
                        {hearing.case.description}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-2 w-2 bg-slate-100 rounded-full mx-auto"></div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
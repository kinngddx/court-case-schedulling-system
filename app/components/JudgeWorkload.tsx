"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
//sab kuch import kiya gya hai bc



export default function JudgeWorkload() {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const res = await fetch("/api/judges");


        if (!res.ok) throw new Error("Failed to fetch judges");
        const data = await res.json();
        setJudges(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJudges();
  }, []);


  
  if (loading) {
    return <p>Loading judge workload...</p>;
  }

  return (
    <div className="w-full h-80">
      <h2 className="text-lg font-semibold mb-4">
        Judge Workload vs Capacity
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={judges}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="currentWorkload" name="Current Workload" fill="#3b82f6" />
          <Bar dataKey="maxCapacity" name="Max Capacity" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
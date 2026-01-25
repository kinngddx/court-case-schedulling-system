"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";

type CaseFormData = {
  caseNumber: string;
  caseType: string;
  filedDate: string;
  description: string;
  crimeSeverity: number;
  isUndertrial: boolean;
  isVictimVulnerable: boolean;
};

export default function CaseForm() {
  const { register, handleSubmit, reset } = useForm<CaseFormData>();
  const [success, setSuccess] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CaseFormData) => {
    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          crimeSeverity: Number(data.crimeSeverity),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create case");
      }

      setSuccess(result.priorityScore);
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <input
        {...register("caseNumber", { required: true })}
        placeholder="Case Number"
        className="input"
      />
      <select {...register("caseType", { required: true })} className="input">
        <option value="">Select Case Type</option>
        <option value="Criminal">Criminal</option>
        <option value="Civil">Civil</option>
        <option value="Family">Family</option>
      </select>
      <input
        type="date"
        {...register("filedDate", { required: true })}
        className="input"
      />
      <textarea
        {...register("description")}
        placeholder="Case Description"
        className="input"
      />
      <input
        type="number"
        min="1"
        max="5"
        {...register("crimeSeverity", { required: true, valueAsNumber: true })}
        placeholder="Crime Severity (1–5)"
        className="input"
      />
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("isUndertrial")} />
        Undertrial
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("isVictimVulnerable")} />
        Victim Vulnerable
      </label>
      <button type="submit" disabled={loading} className="btn">
        {loading ? "Submitting..." : "Submit Case"}
      </button>
      {success !== null && (
        <p className="text-green-600 font-semibold">
          ✅ Case added! Predicted Priority: <b>{success}</b>
        </p>
      )}
    </form>
  );
}
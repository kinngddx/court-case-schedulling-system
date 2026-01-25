import JudgeWorkload from '../components/JudgeWorkload';

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Judge Dashboard</h1>
      <JudgeWorkload />
    </div>
  );
}
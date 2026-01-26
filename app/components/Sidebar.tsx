"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gavel, PlusCircle, RotateCcw } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Cases", href: "/cases", icon: Gavel },
  { name: "New Case", href: "/submit-case", icon: PlusCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 h-screen text-white p-6 fixed left-0 top-0">
      <div className="mb-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <RotateCcw className="text-blue-400" /> NyayaFlow
        </h2>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
          Court Management AI
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
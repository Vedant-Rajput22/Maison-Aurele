import { ArrowUpRight, Calendar, Clock, ShoppingBag, Sparkles, AlertTriangle, Bell } from "lucide-react";
import { getAdminAppointments, getAdminDrops, getAdminOpsSignals, getAdminOverview } from "@/lib/admin/data";

export default async function AdminHomePage() {
  const [overview, drops, appointments, ops] = await Promise.all([
    getAdminOverview(),
    getAdminDrops(),
    getAdminAppointments(),
    getAdminOpsSignals(),
  ]);

  const cards = [
    {
      title: "Live assortment",
      value: overview.products.toString(),
      sub: "Active products",
      icon: ShoppingBag,
    },
    {
      title: "Editorial drops",
      value: drops.length.toString(),
      sub: "Scheduled windows",
      icon: Sparkles,
    },
    {
      title: "Appointments",
      value: appointments.length.toString(),
      sub: "Upcoming 48h",
      icon: Calendar,
    },
    {
      title: "Approvals",
      value: overview.approvals.toString(),
      sub: "Awaiting publish",
      icon: Clock,
    },
  ];

  const signals = [
    `${overview.approvals} items queued for approval`,
    `${ops.lowStock} variants at or below low stock`,
    `${ops.waitlist} guests on waitlists`,
    `${ops.scheduledDrops} drops scheduled`,
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Atelier overview</p>
          <h1 className="font-display text-3xl">Control room</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]">
          New publish <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-6 flex items-center justify-between text-white/70">
                <p className="text-[0.7rem] uppercase tracking-[0.35em]">{card.title}</p>
                <span className="rounded-full bg-white/10 p-2">
                  <Icon size={16} />
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-display text-3xl">{card.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between text-white/70">
            <p className="text-[0.7rem] uppercase tracking-[0.35em]">Priority workflows</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em]">Live</span>
          </div>
          <div className="divide-y divide-white/10">
            {["Curate Capsule Noir", "Approve Atelier Notes", "Refresh Homepage hero", "QA product imagery"].map(
              (item) => (
                <div key={item} className="flex items-center justify-between py-3">
                  <span className="text-sm text-white">{item}</span>
                  <button className="text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white">Open</button>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between text-white/70">
            <p className="text-[0.7rem] uppercase tracking-[0.35em]">Signals</p>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em]">
              <Bell size={14} /> Live
            </span>
          </div>
          <div className="space-y-3 text-sm text-white/80">
            {signals.map((signal) => (
              <p key={signal} className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-white/50" /> {signal}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight, CalendarClock, Phone } from "lucide-react";
import { AdminSection } from "@/components/admin/admin-section";
import { getAdminAppointments } from "@/lib/admin/data";

export default async function AdminAppointmentsPage() {
  const appointments = await getAdminAppointments();

  return (
    <div className="space-y-10">
      <AdminSection
        eyebrow="Concierge"
        title="Appointments"
        description="Manage boutique visits and white-glove services."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <CalendarClock size={14} /> Calendar sync
          </div>
        }
      >
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{appt.guest}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {appt.when.toLocaleString()} · {appt.boutique}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1">{appt.status}</span>
                <Link href={`/admin/appointments/${appt.id}`} className="inline-flex items-center gap-1 hover:text-white">
                  Open <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
          {appointments.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              No appointments scheduled.
            </div>
          ) : null}
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Concierge"
        title="Signals"
        description="Confirm and follow up on bespoke requests."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <Phone size={14} /> Call concierge
          </div>
        }
      >
        <ul className="space-y-2 text-sm text-white/80">
          {[
            "Send Atelier Boot personalization options to Camille",
            "Confirm champagne service for Julien",
            "Add translator request for Elena",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-white/50" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </AdminSection>
    </div>
  );
}

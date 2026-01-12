import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminSection } from "@/components/admin/admin-section";
import {
    updateAppointmentStatus,
    addAppointmentNote,
    rescheduleAppointment,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
    assignConcierge,
} from "@/lib/admin/actions/appointments";
import { prisma } from "@/lib/prisma";
import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react";

type PageParams = { id: string } | Promise<{ id: string }>;

export default async function EditAppointmentPage({ params }: { params: PageParams }) {
    const resolved = await params;
    const appointment = await prisma.appointment.findUnique({
        where: { id: resolved.id },
        include: { user: true },
    });

    if (!appointment) {
        notFound();
    }

    const statusColors: Record<string, string> = {
        requested: "text-amber-400",
        confirmed: "text-emerald-400",
        rescheduled: "text-blue-400",
        cancelled: "text-red-400",
        completed: "text-white/50",
    };

    const statuses = ["requested", "confirmed", "rescheduled", "cancelled", "completed"];

    return (
        <div className="space-y-10">
            <AdminSection
                eyebrow="Concierge"
                title={`Appointment: ${appointment.user?.firstName ?? "Guest"} ${appointment.user?.lastName ?? ""}`}
                description={`Scheduled at ${appointment.boutique}`}
                actions={
                    <div className="flex items-center gap-3">
                        {appointment.status !== "confirmed" && (
                            <form action={confirmAppointment}>
                                <input type="hidden" name="id" value={appointment.id} />
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-300 hover:bg-emerald-500/10"
                                >
                                    <CheckCircle size={14} /> Confirm
                                </button>
                            </form>
                        )}
                        {appointment.status !== "cancelled" && (
                            <form action={cancelAppointment}>
                                <input type="hidden" name="id" value={appointment.id} />
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-full border border-red-400/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-red-300 hover:bg-red-500/10"
                                >
                                    <XCircle size={14} /> Cancel
                                </button>
                            </form>
                        )}
                        {appointment.status !== "completed" && (
                            <form action={completeAppointment}>
                                <input type="hidden" name="id" value={appointment.id} />
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
                                >
                                    <CheckCircle size={14} /> Mark Complete
                                </button>
                            </form>
                        )}
                        <Link
                            href="/admin/appointments"
                            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10"
                        >
                            Back
                        </Link>
                    </div>
                }
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                            <Calendar size={14} />
                            <span>Details</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Guest</p>
                                <p className="text-white">{appointment.user?.firstName} {appointment.user?.lastName}</p>
                            </div>
                            {appointment.user?.email && (
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Email</p>
                                    <p className="text-white">{appointment.user.email}</p>
                                </div>
                            )}
                            {appointment.user?.phone && (
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Phone</p>
                                    <p className="text-white">{appointment.user.phone}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Boutique</p>
                                <p className="text-white">{appointment.boutique}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Scheduled</p>
                                <p className="text-white">{new Date(appointment.appointmentAt).toLocaleString()}</p>
                            </div>
                            {appointment.services && (
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Services</p>
                                    <p className="text-white">{appointment.services}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Status</p>
                                <p className={`font-medium capitalize ${statusColors[appointment.status] ?? "text-white"}`}>
                                    {appointment.status}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 mb-4">
                                <Clock size={14} />
                                <span>Reschedule</span>
                            </div>
                            <form action={rescheduleAppointment} className="space-y-3">
                                <input type="hidden" name="id" value={appointment.id} />
                                <input
                                    type="datetime-local"
                                    name="appointmentAt"
                                    required
                                    className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                />
                                <button
                                    type="submit"
                                    className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white hover:bg-white/20"
                                >
                                    Reschedule
                                </button>
                            </form>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="text-xs uppercase tracking-[0.3em] text-white/60 mb-4">Assign Concierge</div>
                            <form action={assignConcierge} className="flex items-center gap-3">
                                <input type="hidden" name="id" value={appointment.id} />
                                <input
                                    name="concierge"
                                    defaultValue={appointment.concierge ?? ""}
                                    className="flex-1 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                    placeholder="Concierge name"
                                />
                                <button
                                    type="submit"
                                    className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white hover:bg-white/20"
                                >
                                    Assign
                                </button>
                            </form>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="text-xs uppercase tracking-[0.3em] text-white/60 mb-4">Update Status</div>
                            <form action={updateAppointmentStatus} className="flex items-center gap-3">
                                <input type="hidden" name="id" value={appointment.id} />
                                <select
                                    name="status"
                                    defaultValue={appointment.status}
                                    className="flex-1 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s} className="bg-black text-white capitalize">
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white hover:bg-white/20"
                                >
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </AdminSection>

            <AdminSection
                eyebrow="Notes"
                title="Concierge notes"
                description="Internal notes for this appointment."
            >
                <form action={addAppointmentNote} className="space-y-4">
                    <input type="hidden" name="id" value={appointment.id} />
                    <textarea
                        name="notes"
                        rows={4}
                        defaultValue={appointment.notes ?? ""}
                        className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                        placeholder="Add notes about preferences, services requested, etc."
                    />
                    <button
                        type="submit"
                        className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                    >
                        Save notes
                    </button>
                </form>
            </AdminSection>
        </div>
    );
}

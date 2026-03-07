import React from 'react';
import {
  Activity,
  BellRing,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Stethoscope,
  Ticket,
  UserRound,
  Users,
} from 'lucide-react';
import hospitalDashboardImage from '../../assets/hospital-app-dashboard.png';
import queueDisplayDashboardImage from '../../assets/queue-display-dashboard.png';

export const QueuePreview: React.FC = () => (
  <div className="h-full rounded-[1.2rem] border border-white/10 bg-[#dbe7ef] p-2 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)] sm:rounded-[1.45rem]">
    <div className="flex items-center justify-between rounded-[1rem] bg-white px-3 py-2">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Queue Display</p>
        <p className="text-xs text-slate-400">queue-display-eight.vercel.app</p>
      </div>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-100">
        <Ticket className="h-4 w-4 text-sky-600" />
      </div>
    </div>
    <div className="mt-2 overflow-hidden rounded-[1.1rem] border border-slate-200 bg-slate-100">
      <img
        src={queueDisplayDashboardImage}
        alt="Queue display dashboard preview"
        className="h-full w-full object-cover object-left-top"
      />
    </div>
  </div>
);

export const HospitalPreview: React.FC = () => (
  <div className="h-full rounded-[1.2rem] border border-white/10 bg-[#d9e4e8] p-2 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)] sm:rounded-[1.45rem]">
    <div className="flex items-center justify-between rounded-[1rem] bg-white px-3 py-2">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Hospital App</p>
        <p className="text-xs text-slate-400">hospital-app-one.vercel.app</p>
      </div>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
        <Activity className="h-4 w-4 text-emerald-600" />
      </div>
    </div>
    <div className="mt-2 overflow-hidden rounded-[1.1rem] border border-slate-200 bg-slate-100">
      <img
        src={hospitalDashboardImage}
        alt="Hospital app dashboard preview"
        className="h-full w-full object-cover object-left-top"
      />
    </div>
  </div>
);

export const QueueDemoScreen: React.FC = () => (
  <div className="overflow-hidden rounded-[1.4rem] border border-slate-800 bg-[#07101d] text-white shadow-[0_28px_80px_-48px_rgba(15,23,42,0.95)] sm:rounded-[2rem]">
    <div className="border-b border-white/10 bg-[#0a1527] px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/70">Queue Display Demo</p>
          <h2 className="mt-1 text-xl font-display font-bold sm:text-2xl">Realtime Queue Display Console</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
            Connected
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Branch: Main Lobby
          </span>
        </div>
      </div>
    </div>

    <div className="grid gap-4 p-4 sm:gap-5 sm:p-5 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4">
          {[
            ['Total waiting', '18', Users],
            ['Average wait', '07m', Clock3],
            ['Active counters', '04', Ticket],
            ['Completed today', '142', CheckCircle2],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Icon className="h-5 w-5 text-sky-300" />
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/50">{label}</p>
              <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Live Queue Distribution</h3>
            <span className="text-xs text-white/50">Last 30 min</span>
          </div>
          <div className="mt-6 flex h-32 items-end gap-2 sm:h-40 sm:gap-3">
            {[45, 88, 62, 106, 74, 91, 68].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-[1rem] bg-gradient-to-t from-sky-600 to-cyan-300" style={{ height }} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#0b1730] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Now serving</p>
              <p className="mt-2 text-5xl font-display font-extrabold text-white">A-023</p>
            </div>
            <Ticket className="h-12 w-12 text-sky-300" />
          </div>
          <div className="mt-5 h-3 rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            {[
              ['Counter 1', 'A-024'],
              ['Counter 2', 'A-025'],
              ['Counter 3', 'B-011'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/5 p-3">
                <p className="text-white/45">{label}</p>
                <p className="mt-1 font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Ticket Activity</h3>
            <span className="text-xs text-white/50">Auto refreshed</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ['A-026', 'Waiting at registration', 'Just now'],
              ['B-011', 'Sent to Counter 3', '2 min ago'],
              ['A-022', 'Completed successfully', '4 min ago'],
              ['C-004', 'VIP queue joined', '8 min ago'],
            ].map(([ticket, status, time]) => (
              <div key={ticket} className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl bg-white/5 px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <div className="rounded-xl bg-sky-400/15 px-3 py-2 text-sm font-bold text-sky-200">{ticket}</div>
                <div>
                  <p className="font-medium text-white">{status}</p>
                  <p className="text-xs text-white/45">Operator synced with public display</p>
                </div>
                <span className="text-xs text-white/45 sm:text-right">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const HospitalDemoScreen: React.FC = () => (
  <div className="overflow-hidden rounded-[1.4rem] border border-slate-800 bg-[#071318] text-white shadow-[0_28px_80px_-48px_rgba(15,23,42,0.95)] sm:rounded-[2rem]">
    <div className="border-b border-white/10 bg-[#0b1820] px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/70">Hospital App Demo</p>
          <h2 className="mt-1 text-xl font-display font-bold sm:text-2xl">Operational Command Center</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
            Stable
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Shift: Morning
          </span>
        </div>
      </div>
    </div>

    <div className="grid gap-4 p-4 sm:gap-5 sm:p-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4">
          {[
            ['Patients today', '126', Users],
            ['Bed occupancy', '84%', Activity],
            ['Open alerts', '07', BellRing],
            ['Doctors on duty', '19', Stethoscope],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Icon className="h-5 w-5 text-emerald-300" />
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/50">{label}</p>
              <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Unit Occupancy</h3>
            <span className="text-xs text-white/50">Realtime</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ['ER', '92%'],
              ['ICU', '78%'],
              ['Ward A', '81%'],
              ['Radiology', '63%'],
            ].map(([unit, value]) => (
              <div key={unit}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-white/70">{unit}</span>
                  <span className="font-semibold text-white">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#0c1d23] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Patient Board</h3>
            <ClipboardList className="h-5 w-5 text-sky-300" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              ['Alya Putri', 'Radiology', '08:30', 'Checked in'],
              ['Bagas Pratama', 'Cardiology', '09:10', 'In consultation'],
              ['Citra Nabila', 'Observation', '09:40', 'Awaiting room'],
              ['Dimas Akbar', 'ER', '10:05', 'Critical priority'],
            ].map(([name, unit, time, status]) => (
              <div key={name} className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl bg-white/5 px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <UserRound className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <p className="font-semibold text-white">{name}</p>
                  <p className="text-xs text-white/50">{unit} - {status}</p>
                </div>
                <span className="text-xs text-white/45 sm:text-right">{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Operational Alerts</h3>
            <BellRing className="h-5 w-5 text-amber-300" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              ['ER waiting time above SLA', 'Needs triage review'],
              ['ICU room 4 needs approval', 'Doctor confirmation pending'],
              ['Pharmacy low stock: Heparin', 'Refill requested'],
            ].map(([title, subtitle]) => (
              <div key={title} className="rounded-2xl bg-white/5 px-4 py-3">
                <p className="font-medium text-white">{title}</p>
                <p className="mt-1 text-sm text-white/55">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

import { api } from '@/lib/api';

import { useEffect, useState } from 'react';
import { Trash2, Loader2, Mail, Check } from 'lucide-react';

export default function BookingsManager() {
  const [items, setItems] = useState(null);
  const load = async () => { try { setItems(await api.entities.Booking.list('-created_date', 100)); } catch { setItems([]); } };
  useEffect(() => { load(); }, []);
  const mark = async (b) => { await api.entities.Booking.update(b.id, { status: 'confirmed' }); load(); };
  const del = async (id) => { if (confirm('Delete this booking?')) { await api.entities.Booking.delete(id); load(); } };

  return <div className="space-y-4">
    <h2 className="text-xl font-bold">Meeting requests</h2>
    {!items ? <Loader2 className="animate-spin text-[#2A52BE]" size={24} /> : items.length === 0 ? <p className="text-[#575757]">No bookings yet. New requests from your site will appear here.</p> :
      <div className="space-y-3">{items.map(b => (<div key={b.id} className="bg-white rounded-xl border border-black/10 p-4"><div className="flex justify-between gap-4"><div><div className="flex items-center gap-2"><h3 className="font-bold">{b.client_name}</h3><span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-[#00D26A]/15 text-[#00a04c]' : 'bg-[#FF4D00]/15 text-[#FF4D00]'}`}>{b.status || 'pending'}</span></div><p className="text-sm text-[#575757] mt-1">{b.date} · {b.time} (USA ET)</p><p className="text-sm mt-1"><a href={`mailto:${b.client_email}`} className="text-[#2A52BE] inline-flex items-center gap-1"><Mail size={13} /> {b.client_email}</a></p>{b.service && <p className="text-xs text-[#575757] mt-1">{b.service}</p>}{b.message && <p className="text-sm text-[#45454B] mt-2 italic">"{b.message}"</p>}</div><div className="flex flex-col gap-2 shrink-0">{b.status !== 'confirmed' && <button onClick={() => mark(b)} className="inline-flex items-center gap-1 text-xs font-bold text-[#00a04c]"><Check size={14} /> Confirm</button>}<button onClick={() => del(b.id)} className="inline-flex items-center gap-1 text-xs font-bold text-red-600"><Trash2 size={14} /> Delete</button></div></div></div>))}</div>}
  </div>;
}
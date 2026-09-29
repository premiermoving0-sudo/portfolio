import { api } from '@/lib/api';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X, Save } from 'lucide-react';

const empty = { client_name: '', role: '', quote: '', rating: 5, order_index: 0 };

export default function TestimonialsManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => { try { setItems(await api.entities.Testimonial.list('-order_index', 50)); } catch { setItems([]); } };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.client_name || !editing.quote) return;
    if (editing.id) await api.entities.Testimonial.update(editing.id, editing);
    else await api.entities.Testimonial.create(editing);
    setEditing(null); load();
  };
  const del = async (id) => { if (confirm('Delete this testimonial?')) { await api.entities.Testimonial.delete(id); load(); } };

  return <div className="space-y-4">
    <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Testimonials</h2><button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0B] text-white px-4 py-2.5 text-sm font-bold hover:bg-[#2A52BE]"><Plus size={16} /> Add testimonial</button></div>
    {!items ? <Loader2 className="animate-spin text-[#2A52BE]" size={24} /> : items.length === 0 ? <p className="text-[#575757]">No testimonials yet.</p> :
      <div className="space-y-3">{items.map(t => (<div key={t.id} className="bg-white rounded-xl border border-black/10 p-4 flex justify-between gap-4"><div><p className="text-sm">"{t.quote}"</p><p className="mt-2 text-xs font-bold">{t.client_name} · <span className="text-[#575757] font-normal">{t.role}</span> · {'★'.repeat(t.rating || 5)}</p></div><div className="flex gap-3 shrink-0"><button onClick={() => setEditing(t)} className="text-[#2A52BE]"><Pencil size={16} /></button><button onClick={() => del(t.id)} className="text-red-600"><Trash2 size={16} /></button></div></div>))}</div>}

    {editing && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}><div className="bg-white rounded-2xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">{editing.id ? 'Edit testimonial' : 'New testimonial'}</h3><button onClick={() => setEditing(null)}><X size={20} /></button></div>
      <div className="space-y-3">
        <input value={editing.client_name} onChange={e => setEditing({ ...editing, client_name: e.target.value })} placeholder="Client name *" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" />
        <input value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} placeholder="Role / company" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" />
        <textarea value={editing.quote} onChange={e => setEditing({ ...editing, quote: e.target.value })} placeholder="Quote *" rows={3} className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" />
        <div className="grid grid-cols-2 gap-3"><select value={editing.rating} onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })} className="rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none">{[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} stars</option>)}</select><input type="number" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: Number(e.target.value) })} placeholder="Order" className="rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" /></div>
        <button onClick={save} className="w-full rounded-xl bg-[#FF4D00] text-white py-3 font-bold inline-flex items-center justify-center gap-2"><Save size={16} /> Save testimonial</button>
      </div>
    </div></div>}
  </div>;
}
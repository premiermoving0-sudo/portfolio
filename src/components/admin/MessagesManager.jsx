import { useEffect, useState } from 'react';
import { Trash2, Loader2, Mail } from 'lucide-react';
import { api } from '@/lib/api';

export default function MessagesManager() {
  const [items, setItems] = useState(null);
  const load = async () => { try { setItems(await api.entities.Message.list('-created_date', 100)); } catch { setItems([]); } };
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (confirm('Delete this message?')) { await api.entities.Message.delete(id); load(); } };
  return <div className="space-y-4">
    <h2 className="text-xl font-bold">Contact messages</h2>
    {!items ? <Loader2 className="animate-spin text-[#2A52BE]" size={24} /> : items.length === 0 ? <p className="text-[#575757]">No messages yet. Enquiries from the contact form appear here.</p> :
      <div className="space-y-3">{items.map(m => (
        <div key={m.id} className="bg-white rounded-xl border border-black/10 p-4 flex justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-bold">{m.name} <span className="text-xs font-normal text-[#575757]">· {new Date(m.created_date).toLocaleString()}</span></h3>
            <p className="text-xs text-[#575757] mt-0.5">{m.mode}{m.service ? ` · ${m.service}` : ''}</p>
            <p className="text-sm mt-2 whitespace-pre-wrap break-words">{m.message}</p>
            <a href={`mailto:${m.email}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#2A52BE] font-bold"><Mail size={14} /> {m.email}</a>
          </div>
          <button onClick={() => del(m.id)} className="text-red-600 shrink-0 self-start"><Trash2 size={16} /></button>
        </div>))}
      </div>}
  </div>;
}

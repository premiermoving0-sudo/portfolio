import { api } from '@/lib/api';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X, Upload, Save } from 'lucide-react';

import { Image } from '@/components/ui/image';

const empty = { title: '', description: '', image_url: '', category: '', link: '', order_index: 0 };

export default function ProjectsManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => { try { setItems(await api.entities.Project.list('-order_index', 50)); } catch { setItems([]); } };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.title) return;
    if (editing.id) await api.entities.Project.update(editing.id, editing);
    else await api.entities.Project.create(editing);
    setEditing(null); load();
  };
  const del = async (id) => { if (confirm('Delete this project?')) { await api.entities.Project.delete(id); load(); } };
  const upload = async (file) => { setUploading(true); try { const res = await api.integrations.Core.UploadPublicFile({ file }); setEditing(e => ({ ...e, image_url: res.file_url })); } catch { alert('Upload failed'); } setUploading(false); };

  return <div className="space-y-4">
    <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Projects</h2><button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0B] text-white px-4 py-2.5 text-sm font-bold hover:bg-[#2A52BE]"><Plus size={16} /> Add project</button></div>
    {!items ? <Loader2 className="animate-spin text-[#2A52BE]" size={24} /> : items.length === 0 ? <p className="text-[#575757]">No projects yet.</p> :
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(p => (<div key={p.id} className="bg-white rounded-xl border border-black/10 overflow-hidden"><div className="h-32 bg-[#E2E5ED]">{p.image_url && <Image src={p.image_url} className="w-full h-full object-cover" />}</div><div className="p-4"><h3 className="font-bold text-sm">{p.title}</h3>{p.category && <span className="text-[10px] uppercase tracking-wider text-[#575757]">{p.category}</span>}<p className="text-xs text-[#575757] mt-1 line-clamp-2">{p.description}</p><div className="flex gap-3 mt-3"><button onClick={() => setEditing(p)} className="inline-flex items-center gap-1 text-xs font-bold text-[#2A52BE]"><Pencil size={13} /> Edit</button><button onClick={() => del(p.id)} className="inline-flex items-center gap-1 text-xs font-bold text-red-600"><Trash2 size={13} /> Delete</button></div></div></div>))}</div>}

    {editing && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}><div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">{editing.id ? 'Edit project' : 'New project'}</h3><button onClick={() => setEditing(null)}><X size={20} /></button></div>
      <div className="space-y-3">
        <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Title *" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" />
        <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" />
        <div className="grid grid-cols-2 gap-3"><input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="Category" className="rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" /><input type="number" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: Number(e.target.value) })} placeholder="Order" className="rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" /></div>
        <input value={editing.link} onChange={e => setEditing({ ...editing, link: e.target.value })} placeholder="Project link (optional)" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#2A52BE] focus:outline-none" />
        <div className="flex items-center gap-3"><label className="inline-flex items-center gap-2 cursor-pointer rounded-full bg-[#F4F4F7] border border-black/10 px-4 py-2 text-xs font-bold hover:border-black">{uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload image<input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && upload(e.target.files[0])} /></label>{editing.image_url && <span className="text-xs text-[#00a04c] font-bold">✓ image set</span>}</div>
        <button onClick={save} className="w-full rounded-xl bg-[#FF4D00] text-white py-3 font-bold inline-flex items-center justify-center gap-2"><Save size={16} /> Save project</button>
      </div>
    </div></div>}
  </div>;
}
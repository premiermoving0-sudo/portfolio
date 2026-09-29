import { api } from '@/lib/api';

import { useEffect, useState } from 'react';
import { Save, Loader2, Upload, Check } from 'lucide-react';

import { DEFAULT_SETTINGS } from '@/lib/siteDefaults';

const FIELDS = [
  { key: 'hero_name', label: 'Hero name' },
  { key: 'hero_subtext', label: 'Hero subtext', area: true },
  { key: 'cover_image_url', label: 'Cover / portrait image', upload: 'image' },
  { key: 'about_text_1', label: 'About paragraph 1', area: true },
  { key: 'about_text_2', label: 'About paragraph 2', area: true },
  { key: 'resume_url', label: 'Résumé PDF', upload: 'file' },
  { key: 'email', label: 'Contact email' },
  { key: 'phone', label: 'Phone' },
  { key: 'whatsapp', label: 'WhatsApp number (digits only)' },
  { key: 'location', label: 'Location line' },
  { key: 'hourly_price', label: 'Hourly price' },
  { key: 'hourly_features', label: 'Hourly features (one per line)', area: true, tall: true },
  { key: 'project_price', label: 'Project price' },
  { key: 'project_features', label: 'Project features (one per line)', area: true, tall: true },
  { key: 'fulltime_price', label: 'Full-time price' },
  { key: 'fulltime_features', label: 'Full-time features (one per line)', area: true, tall: true }
];

export default function SettingsManager() {
  const [rec, setRec] = useState(null);
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const list = await api.entities.SiteSetting.list('-updated_date', 1); if (list[0]) { setRec(list[0]); setForm({ ...DEFAULT_SETTINGS, ...list[0] }); } } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true); setSaved(false);
    try {
      if (rec) await api.entities.SiteSetting.update(rec.id, form);
      else { const created = await api.entities.SiteSetting.create(form); setRec(created); }
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (e) { alert('Save failed: ' + (e.message || 'error')); }
    setSaving(false);
  };

  const upload = async (key, file) => {
    setUploading(key);
    try { const res = await api.integrations.Core.UploadPublicFile({ file }); setForm(f => ({ ...f, [key]: res.file_url })); }
    catch { alert('Upload failed'); }
    setUploading('');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#2A52BE]" size={28} /></div>;

  return <div className="bg-white rounded-2xl border border-black/10 p-6 md:p-8">
    <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Site content & pricing</h2><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0B] text-white px-5 py-2.5 text-sm font-bold hover:bg-[#2A52BE] disabled:opacity-50">{saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save changes</>}</button></div>
    <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
      {FIELDS.map(f => (<div key={f.key} className={f.area ? 'md:col-span-2' : ''}>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#575757] mb-2">{f.label}</label>
        {f.area ? <textarea value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} rows={f.tall ? 5 : 3} className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#2A52BE]" />
          : <input value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#2A52BE]" />}
        {f.upload && <div className="mt-2 flex items-center gap-3"><label className="inline-flex items-center gap-2 cursor-pointer rounded-full bg-[#F4F4F7] border border-black/10 px-4 py-2 text-xs font-bold hover:border-black">{uploading === f.key ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload {f.upload}<input type="file" className="hidden" accept={f.upload === 'image' ? 'image/*' : 'application/pdf'} onChange={e => e.target.files[0] && upload(f.key, e.target.files[0])} /></label>{form[f.key] && <span className="text-xs text-[#00a04c] font-bold">✓ set</span>}</div>}
      </div>))}
    </div>
    <p className="mt-6 text-xs text-[#8a8a8f]">Uploaded cover image and résumé are stored publicly — each file gets a permanent public URL that never expires, and anyone with the link can access it.</p>
  </div>;
}
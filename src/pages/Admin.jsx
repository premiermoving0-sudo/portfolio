import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquareQuote, Settings as SettingsIcon, CalendarCheck, Inbox, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import ProjectsManager from '@/components/admin/ProjectsManager';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import SettingsManager from '@/components/admin/SettingsManager';
import BookingsManager from '@/components/admin/BookingsManager';
import MessagesManager from '@/components/admin/MessagesManager';

const tabs = [['content', SettingsIcon, 'Content & pricing'], ['projects', FolderKanban, 'Projects'], ['testimonials', MessageSquareQuote, 'Testimonials'], ['bookings', CalendarCheck, 'Bookings'], ['messages', Inbox, 'Messages']];

export default function Admin() {
  const [tab, setTab] = useState('content');
  const { user, logout } = useAuth();
  return <div className="min-h-screen bg-[#F4F4F7]">
    <header className="sticky top-0 z-20 bg-[#0A0A0B] text-white"><div className="mx-auto max-w-[1400px] px-5 md:px-8 h-16 flex items-center justify-between"><div className="flex items-center gap-3"><LayoutDashboard size={20} /><span className="font-black tracking-tight">Adeel · Admin</span></div><div className="flex items-center gap-4 text-sm"><Link to="/" className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-white"><ExternalLink size={15} /> View site</Link><span className="hidden md:block text-white/50">{user?.email}</span><button onClick={() => logout()} className="flex items-center gap-1.5 text-white/70 hover:text-white"><LogOut size={15} /> Logout</button></div></div></header>
    <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-8"><div className="flex flex-wrap gap-2 mb-8">{tabs.map(([id, Icon, label]) => (<button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${tab === id ? 'bg-[#0A0A0B] text-white' : 'bg-white border border-black/10 hover:border-black'}`}><Icon size={16} /> {label}</button>))}</div>
      {tab === 'content' && <SettingsManager />}
      {tab === 'projects' && <ProjectsManager />}
      {tab === 'testimonials' && <TestimonialsManager />}
      {tab === 'bookings' && <BookingsManager />}
      {tab === 'messages' && <MessagesManager />}
    </div>
  </div>;
}
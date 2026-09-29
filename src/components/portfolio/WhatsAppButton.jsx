import { MessageCircle } from 'lucide-react';
export default function WhatsAppButton({ number }) {
  const n = number || '923244411170';
  return <a href={`https://wa.me/${n}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-4 pr-5 py-3.5 shadow-[0_12px_30px_-8px_rgba(37,211,102,.7)] hover:scale-105 transition-transform"><span className="absolute inset-0 rounded-full bg-[#25D366] wa-ping opacity-30 group-hover:opacity-0" /><MessageCircle size={22} className="text-white relative" /><span className="font-bold text-sm hidden sm:inline relative">WhatsApp</span></a>;
}
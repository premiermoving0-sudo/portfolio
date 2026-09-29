import { Reveal } from '@/lib/motion';
const studies = [
  { tag: 'Customer Support · QA', title: 'Amazon North America — QA & coaching program', body: 'Promoted from agent to QA officer at iBEX, supporting Amazon\u2019s North American voice and chat operation. Built quality monitoring and coaching workflows, tracked CSAT and compliance, and helped agents improve through structured feedback.', result: 'Agent \u2192 QA officer promotion', metric: 'Voice + chat quality', client: 'iBEX / Amazon NA' },
  { tag: 'Brand & Operations', title: 'Godfather Burgers — from concept to launch', body: 'Founded a food brand end to end: positioning, identity, packaging, menu, operations and marketing. Led the team and vendors from the first idea to a live, operating business.', result: '0 \u2192 1 brand launched', metric: 'Full identity system', client: 'Godfather Burgers' },
  { tag: 'Digital Agency', title: 'Emirates WebMaster — UAE digital agency', body: 'Founded a UAE digital agency delivering websites, SEO and social media for small businesses. Owned strategy, client delivery, design and development from start to finish.', result: 'Agency founded & run', metric: 'Web \u00b7 SEO \u00b7 Social', client: 'Emirates WebMaster LLC' }
];
export default function CaseStudies() {
  return (
    <section id="cases" className="bg-[#F4F4F7] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <p className="section-kicker">Case studies</p>
              <h2 className="section-title mt-5">Work that<br /><span className="text-[#D93F00]">moved the needle.</span></h2>
            </div>
            <p className="max-w-[360px] text-[#45454B] leading-relaxed">Three real engagements across support, brand and digital — scope, what I did, and the outcome.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 lg:gap-7">
          {studies.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <article className="h-full bg-white rounded-2xl border border-black/10 p-7 lg:p-8 flex flex-col hover:border-[#0A0A0B] transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#2A52BE]">{s.tag}</span>
                <h3 className="mt-4 text-xl md:text-2xl font-bold tracking-tight leading-snug">{s.title}</h3>
                <p className="mt-4 text-sm text-[#45454B] leading-relaxed flex-1">{s.body}</p>
                <div className="mt-6 pt-5 border-t border-black/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#8a8a8f]">Outcome</span>
                    <span className="block text-sm font-bold text-[#D93F00]">{s.result}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase tracking-wider text-[#8a8a8f]">{s.client}</span>
                    <span className="block text-xs font-semibold text-[#45454B]">{s.metric}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-[#575757]">Want detailed metrics for a specific engagement? <a href="#book" className="font-bold text-[#2A52BE] hover:underline">Book a call</a> and I&rsquo;ll share the numbers.</p>
      </div>
    </section>
  );
}
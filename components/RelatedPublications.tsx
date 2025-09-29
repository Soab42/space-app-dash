
import Link from 'next/link';
import { Pub } from '@/app/publications/[id]/page';

interface RelatedPublicationsProps {
  publications: Pub[];
}

const RelatedPublications: React.FC<RelatedPublicationsProps> = ({ publications }) => {
  if (!publications || publications.length === 0) {
    return null;
  }

  return (
    <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
      <div className="px-6 py-5 border-b border-slate-200/30">
        <h3 className="font-medium text-slate-800 flex items-center gap-3">
          <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
          Related Publications
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {publications.map((pub) => (
            <Link key={pub.id} href={`/publications/${pub.id}`} className="block hover:bg-slate-50 p-3 rounded-lg transition-colors duration-200">
              <h4 className="font-semibold text-slate-800 text-sm mb-1">{pub.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {pub.date_month} {pub.date_year}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedPublications;

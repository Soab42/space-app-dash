'use client';

import React, { useState, useEffect } from 'react';
import { api, API_BASE } from '@/lib/api';
import { notFound, useRouter } from 'next/navigation';
import { Pub as Publication, Tag } from '../page';


const EditPublicationPage = ({ params }: { params: { id: string } }) => {
  const [publication, setPublication] = useState<Publication | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const pub = await api<Publication>(`/publications/${params.id}`);
        if (!pub) {
          notFound();
        } else {
          setPublication(pub);
          setFormData({
            ...pub,
            authors: JSON.stringify(pub.authors, null, 2),
            tags: pub.tags ? pub.tags.map((t: Tag) => t.name).join(', ') : '',
            faqs: JSON.stringify(pub.faqs, null, 2),
            knowledge_graph: JSON.stringify(pub.knowledge_graph, null, 2),
            knowledgeable_insights: JSON.stringify(pub.knowledgeable_insights, null, 2),
            knowledge_gaps: JSON.stringify(pub.knowledge_gaps, null, 2),
            consensus_disagreement: JSON.stringify(pub.consensus_disagreement, null, 2),
            others_data: JSON.stringify(pub.others_data, null, 2),
          });
        }
      } catch (err) {
        setError('Failed to fetch publication data.');
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchPublication();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { id, add_more_context, ...restOfFormData } = formData;

      const updatePayload = {
        ...restOfFormData,
        authors: JSON.parse(formData.authors).map(({ id: authorId, ...author }) => author),
        tags: formData.tags.split(',').map((t: string) => t.trim()),
        faqs: JSON.parse(formData.faqs),
        knowledge_graph: JSON.parse(formData.knowledge_graph),
        knowledgeable_insights: JSON.parse(formData.knowledgeable_insights),
        knowledge_gaps: JSON.parse(formData.knowledge_gaps),
        consensus_disagreement: JSON.parse(formData.consensus_disagreement),
        others_data: JSON.parse(formData.others_data),
      };

      // Remove 'id' from category and subcategory if they exist
      if (updatePayload.category) {
        updatePayload.category = { title: updatePayload.category.title };
      }
      if (updatePayload.subcategory) {
        updatePayload.subcategory = {
          title: updatePayload.subcategory.title,
          category_id: updatePayload.subcategory.category_id,
        };
      }

      const res = await fetch(`${API_BASE}/publications/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        throw new Error('Failed to update publication');
      }

      router.push(`/publications/${params.id}`);
    } catch (err) {
      setError('Failed to update publication.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(formData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
            Edit Publication
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50 p-10"
        >
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">
                  Basic Information
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="abstract"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Abstract
                  </label>
                  <textarea
                    id="abstract"
                    value={formData.abstract || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Metadata</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="date_year"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Year
                  </label>
                  <input
                    id="date_year"
                    value={formData.date_year || ''}
                    onChange={handleChange}
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="date_month"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Month
                  </label>
                  <input
                    id="date_month"
                    value={formData.date_month || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="organism"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Organism
                  </label>
                  <input
                    id="organism"
                    value={formData.organism || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="environment"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Environment
                  </label>
                  <input
                    id="environment"
                    value={formData.environment || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="original_link"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Original Link
                  </label>
                  <input
                    id="original_link"
                    value={formData.original_link || ''}
                    onChange={handleChange}
                    type="url"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Authors</h2>
              </div>
              <div>
                <label
                  htmlFor="authors"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Authors (JSON Format)
                </label>
                <textarea
                  id="authors"
                  value={formData.authors || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">AI-generated fields</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="summary_of_abstract"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Summary of abstract
                  </label>
                  <textarea
                    id="summary_of_abstract"
                    value={formData.summary_of_abstract || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="summary_for_scientist"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Summary for scientist
                  </label>
                  <textarea
                    id="summary_for_scientist"
                    value={formData.summary_for_scientist || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="summary_for_investor"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Summary for investor
                  </label>
                  <textarea
                    id="summary_for_investor"
                    value={formData.summary_for_investor || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="summary_for_mission_architect"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Summary for mission architect
                  </label>
                  <textarea
                    id="summary_for_mission_architect"
                    value={formData.summary_for_mission_architect || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="knowledgeable_insights"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Knowledgeable insights (JSON)
                  </label>
                  <textarea
                    id="knowledgeable_insights"
                    value={formData.knowledgeable_insights || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="knowledge_gaps"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Knowledge gaps (JSON)
                  </label>
                  <textarea
                    id="knowledge_gaps"
                    value={formData.knowledge_gaps || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="consensus_disagreement"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Consensus disagreement (JSON)
                  </label>
                  <textarea
                    id="consensus_disagreement"
                    value={formData.consensus_disagreement || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="faqs"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    FAQs (JSON)
                  </label>
                  <textarea
                    id="faqs"
                    value={formData.faqs || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="knowledge_graph"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Knowledge graph (JSON)
                  </label>
                  <textarea
                    id="knowledge_graph"
                    value={formData.knowledge_graph || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Tags (comma-separated)
                  </label>
                  <input
                    id="tags"
                    value={formData.tags ? formData?.tags: ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="others_data"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Others data (JSON)
                  </label>
                  <textarea
                    id="others_data"
                    value={formData.others_data || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Add More Context</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="add_more_context"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Add More Context
                  </label>
                  <textarea
                    id="add_more_context"
                    value={formData.add_more_context || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-6 border-t border-slate-200/30">
              <button
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-800/25 focus:outline-none focus:ring-2 focus:ring-slate-400/60"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPublicationPage;

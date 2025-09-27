import React, { useState } from 'react';

interface SubCategoryFormProps {
  onSave: (subCategory: { title: string; description?: string; image?: string; category_id: number }) => void;
  onCancel: () => void;
  categories: { id: number; title: string }[];
  initialData?: { title: string; description?: string; image?: string; category_id: number };
}

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({ onSave, onCancel, categories, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, image, category_id: categoryId });
  };

  return (
    <form onSubmit={handleSubmit} className='text-black'>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white/80 border border-slate-300/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white/80 border border-slate-300/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-slate-700">Image URL</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white/80 border border-slate-300/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 bg-white/80 border border-slate-300/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button type="button" onClick={onCancel} className="mr-2 px-4 py-2 rounded-xl bg-slate-200/80 text-slate-800 hover:bg-slate-300/80 focus:outline-none focus:ring-2 focus:ring-slate-400/50 shadow-sm">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400/50 shadow-sm">
          Save
        </button>
      </div>
    </form>
  );
};

export default SubCategoryForm;

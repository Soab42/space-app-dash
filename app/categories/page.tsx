"use client";

import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import CategoryForm from "../../components/CategoryForm";
import SubCategoryForm from "../../components/SubCategoryForm";
import { PencilIcon } from "../../components/icons/PencilIcon";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { PlusIcon } from "../../components/icons/PlusIcon";
import { ChevronDownIcon } from "../../components/icons/ChevronDownIcon";
import { api } from "@/lib/api";
import { Category, SubCategory } from "../publications/page";
import AuthGuard from "@/components/AuthGuard";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(
    categories[0]?.id || 0
  );
  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api<Category[]>("/categories");
      if (res) {
        setCategories(res);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error(error);
      // This will be caught by the nearest error boundary
      throw error;
    }
  };

  const handleSaveCategory = async (formData: {
    title: string;
    description?: string;
    image?: string;
  }) => {
    const url = editingCategory
      ? `/categories/${editingCategory.id}`
      : "/categories";
    const method = editingCategory ? "PUT" : "POST";

    try {
      const res = await api<Category>(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res) {
        fetchCategories();
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
      } else {
        console.log("Failed to save category");
        throw new Error("Failed to save category");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSaveSubCategory = async (formData: {
    title: string;
    description?: string;
    image?: string;
  }) => {
    const url = editingSubCategory
      ? `/categories/subcategories/${editingSubCategory.id}`
      : "/categories/subcategories/";
    const method = editingSubCategory ? "PUT" : "POST";

    try {
      const res = await api<SubCategory>(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res) {
        fetchCategories();
        setIsSubCategoryModalOpen(false);
        setEditingSubCategory(null);
      } else {
        console.log("Failed to save subcategory");
        throw new Error("Failed to save subcategory");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const res = await api<Category>(`/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (res) {
        fetchCategories();
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: number) => {
    try {
      const res = await api<SubCategory>(
        `/categories/subcategories/${subCategoryId}`,
        {
          method: "DELETE",
        }
      );
      if (res) {
        fetchCategories();
      } else {
        throw new Error("Failed to delete subcategory");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const CollapsibleRow = ({ category }: { category: Category }) => {
    const isRowOpen = openRows[category.id];

    return (
      <React.Fragment>
        <tr className="border-b border-slate-200/50">
          <td className="p-4">
            <button
              onClick={() => toggleRow(category.id)}
              className="h-6 w-6 grid place-items-center rounded-md bg-slate-700/40 hover:bg-slate-900/60 border border-white/50 shadow-sm"
            >
              <ChevronDownIcon
                className={`h-4 w-4 text-white transition-transform ${
                  isRowOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </td>
          <td className="p-4 font-medium text-slate-800 capitalize">
            {category.title}
          </td>
          <td className="p-4 text-slate-500">{category.description}</td>
          <td className="p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(category.id);
                  setIsSubCategoryModalOpen(true);
                }}
                className="h-9 w-9 grid place-items-center rounded-xl bg-emerald-100 hover:bg-emerald-200 border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                title="Add Subcategory"
              >
                <PlusIcon className="h-5 w-5 text-emerald-900" />
              </button>
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setIsCategoryModalOpen(true);
                }}
                className="h-9 w-9 grid place-items-center rounded-xl bg-slate-700/40 hover:bg-slate-900/60 border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                title="Edit Category"
              >
                <PencilIcon className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="h-9 w-9 grid place-items-center rounded-xl bg-red-100 hover:bg-red-200 border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400/50"
                title="Delete Category"
              >
                <TrashIcon className="h-4 w-4 text-red-900" />
              </button>
            </div>
          </td>
        </tr>
        {isRowOpen && (
          <tr>
            <td colSpan={4} className="p-4 pl-12">
              <div className="rounded-xl bg-white/40 p-4">
                <h3 className="font-semibold text-slate-700 mb-2">
                  Subcategories
                </h3>
                <table className="w-full">
                  <tbody>
                    {category?.subcategories?.map((subcategory) => (
                      <tr
                        key={subcategory.id}
                        className="border-b border-slate-200/50 last:border-b-0"
                      >
                        <td className="p-3 font-medium text-slate-700">
                          {subcategory.title}
                        </td>
                        <td className="p-3 text-slate-500">
                          {subcategory.description}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              onClick={() => {
                                setSelectedCategory(category.id);
                                setEditingSubCategory(subcategory);
                                setIsSubCategoryModalOpen(true);
                              }}
                              className="h-8 w-8 grid place-items-center rounded-lg bg-slate-700/40 hover:bg-slate-900/60 border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                              title="Edit Subcategory"
                            >
                              <PencilIcon className="h-4 w-4 text-white" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSubCategory(subcategory.id)
                              }
                              className="h-8 w-8 grid place-items-center rounded-lg bg-red-200 hover:bg-red-400 border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400/50"
                              title="Delete Subcategory"
                            >
                              <TrashIcon className="h-4 w-4 text-red-900" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  return (
    <AuthGuard>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Categories & Subcategories
          </h1>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400/50 shadow-sm"
          >
            Add Category
          </button>
        </div>

        {/* Category Modal */}
        <Modal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          title={editingCategory ? "Edit Category" : "Add Category"}
        >
          <CategoryForm
            onSave={handleSaveCategory}
            onCancel={() => {
              setIsCategoryModalOpen(false);
              setEditingCategory(null);
            }}
            initialData={editingCategory}
          />
        </Modal>

        {/* SubCategory Modal */}
        <Modal
          isOpen={isSubCategoryModalOpen}
          onClose={() => {
            setIsSubCategoryModalOpen(false);
            setEditingSubCategory(null);
          }}
          title={editingSubCategory ? "Edit SubCategory" : "Add SubCategory"}
        >
          <SubCategoryForm
            onSave={handleSaveSubCategory}
            onCancel={() => {
              setIsSubCategoryModalOpen(false);
              setEditingSubCategory(null);
            }}
            categories={categories}
            initialData={
              editingSubCategory
                ? {
                    ...editingSubCategory,
                    category_id: selectedCategory || 0, // Provide a default number (0 or any other default category ID)
                  }
                : {
                    title: "",
                    description: "",
                    category_id: selectedCategory || categories[0]?.id || 0,
                  }
            }
          />
        </Modal>

        <div className="rounded-2xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/50">
              <tr>
                <th className="p-4 w-12"></th>
                <th className="p-4 font-semibold text-slate-800">Category</th>
                <th className="p-4 font-semibold text-slate-800">Description</th>
                <th className="p-4 font-semibold text-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <CollapsibleRow key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CategoriesPage;

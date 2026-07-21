'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload, CheckCircle2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getProducts } from '@/lib/firebase-db';
import { uploadImage } from '@/lib/storage';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const productRef = doc(db, 'products', editingProduct.id);
      await updateDoc(productRef, {
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
        variants: editingProduct.variants,
      });
      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploadingImage(true);
    try {
      const downloadUrl = await uploadImage(file, `products/${editingProduct.id}`);
      
      // Update local state to show new image instantly
      const updatedVariants = [...editingProduct.variants];
      if (!updatedVariants[0]) {
        updatedVariants[0] = { id: 'v1', color: 'Default', colorHex: '#000000', sizes: [{ size: 'OS', stock: 10, sku: 'ADM-OS' }], images: [] };
      }
      updatedVariants[0].images = [downloadUrl, ...updatedVariants[0].images];
      
      setEditingProduct({
        ...editingProduct,
        variants: updatedVariants
      });
      
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    if (!editingProduct) return;
    const updatedVariants = [...editingProduct.variants];
    updatedVariants[0].images.splice(index, 1);
    setEditingProduct({ ...editingProduct, variants: updatedVariants });
  };

  return (
    <div className="min-h-screen bg-cr-black flex">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-8">
          <h1 className="text-white font-serif text-xl font-light">Products Manager</h1>
          <button className="bg-cr-gold text-cr-black px-4 py-2 text-[10px] tracking-widest uppercase font-semibold flex items-center gap-2 hover:bg-white transition-colors">
            <Plus size={14} /> Add Product
          </button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-cr-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#111] border border-white/10 p-4 hover:border-white/30 transition-colors group">
                  <div className="aspect-[4/5] bg-[#0a0a0a] relative mb-4 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.variants[0]?.images[0] || '/placeholder.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-serif text-lg">{product.name}</h3>
                    <p className="text-white/50 text-xs mt-1">{product.category}</p>
                    <p className="text-cr-gold text-sm mt-2">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && editingProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h2 className="text-white font-serif text-2xl">Edit Product</h2>
                <button onClick={handleCloseModal} className="text-white/50 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form id="edit-form" onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-2">Product Name</label>
                      <input 
                        type="text" 
                        value={editingProduct.name}
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-cr-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-2">Price (₹)</label>
                      <input 
                        type="number" 
                        value={editingProduct.price}
                        onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-cr-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/50 text-[10px] tracking-widest uppercase mb-2">Category</label>
                    <input 
                      type="text" 
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 focus:outline-none focus:border-cr-gold transition-colors"
                    />
                  </div>

                  {/* Image Management Section */}
                  <div className="border-t border-white/10 pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-white/50 text-[10px] tracking-widest uppercase">Product Images</label>
                      <div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="bg-white/10 text-white px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
                        >
                          {uploadingImage ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <Upload size={14} />
                          )}
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {editingProduct.variants[0]?.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-[#0a0a0a] border border-white/10 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                          {idx === 0 && (
                            <div className="absolute bottom-2 left-2 bg-cr-gold text-cr-black text-[9px] px-2 py-0.5 tracking-widest uppercase font-semibold">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#0a0a0a]">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-white/50 hover:text-white transition-colors text-xs tracking-widest uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="edit-form"
                  className="bg-cr-gold text-cr-black px-6 py-3 text-xs tracking-widest uppercase font-semibold hover:bg-white transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { uploadImage } from '@/lib/storage';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface HomepageContent {
  heroImage: string;
  campaignBagsImage: string;
  campaignShoesImage: string;
  featuredSplitImage: string;
}

const defaultContent: HomepageContent = {
  heroImage: '/hero-1.jpg',
  campaignBagsImage: '/campaign-bags.jpg',
  campaignShoesImage: '/campaign-shoes.jpg',
  featuredSplitImage: '/bag-1.jpg',
};

export default function AdminContentPage() {
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const docRef = doc(db, 'site_content', 'homepage');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data() as HomepageContent);
      } else {
        // Create it if it doesn't exist
        await setDoc(docRef, defaultContent);
        setContent(defaultContent);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_content', 'homepage'), content);
      alert("Homepage content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof HomepageContent) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const downloadUrl = await uploadImage(file, 'content/homepage');
      setContent(prev => ({ ...prev, [field]: downloadUrl }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingField(null);
    }
  };

  const renderImageUploader = (label: string, field: keyof HomepageContent, aspect: string) => {
    return (
      <div className="bg-[#111] border border-white/10 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-serif text-lg">{label}</h3>
          <div>
            <label className={`cursor-pointer bg-white/10 text-white px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/20 transition-colors ${uploadingField === field ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploadingField === field ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Upload size={14} />
              )}
              {uploadingField === field ? 'Uploading...' : 'Replace Image'}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, field)}
              />
            </label>
          </div>
        </div>
        <div className={`relative bg-[#0a0a0a] border border-white/10 overflow-hidden ${aspect}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={content[field]} 
            alt={label} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cr-black flex">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-8">
          <h1 className="text-white font-serif text-xl font-light">Homepage Content</h1>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-cr-gold text-cr-black px-6 py-2 text-[10px] tracking-widest uppercase font-semibold flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-cr-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="max-w-5xl space-y-8">
              <p className="text-white/60 text-sm">
                Update the primary images used on the homepage. Changes here apply immediately after saving.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderImageUploader('Hero Banner (Top)', 'heroImage', 'aspect-[16/9] md:aspect-[21/9]')}
                {renderImageUploader('Featured Split Section', 'featuredSplitImage', 'aspect-[4/5] max-w-sm mx-auto')}
              </div>

              <h3 className="text-white font-serif text-2xl pt-8 border-t border-white/10">Campaign Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderImageUploader('Campaign Bags', 'campaignBagsImage', 'aspect-[4/5]')}
                {renderImageUploader('Campaign Shoes', 'campaignShoesImage', 'aspect-[4/5]')}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

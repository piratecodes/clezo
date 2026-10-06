import { useState, useEffect } from 'react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import useDocumentMeta from '@/hooks/useDocumentMeta';

import ContactForm from '@/components/settings/ContactForm';

export default function SettingsPage() {
  //Title & Description for SEO (and nice browser tab titles!)
  useDocumentMeta("Company Settings | Clezo Express Laundry", "Configure global contact details, addresses, and social links for your moving business in one centralized location.");
  
  const [contactData, setContactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetchClient('/contact');
        // If it's the very first time and no data exists, backend returns empty object, which is fine!
        setContactData(response.data.contact || {});
      } catch (error) {
        toast.error('Failed to load company settings');
        console.error("Settings Load Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto pb-12 relative z-10">
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Company Settings</h1>
        <p className="text-slate-400 font-medium mt-1">Configure global contact details, addresses, and social links.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative z-10">
          <Loader2 className="animate-spin text-primary mb-4" size={40} />
          <p className="text-slate-400 font-bold tracking-wide">Retrieving configuration...</p>
        </div>
      ) : (
        <ContactForm initialData={contactData} />
      )}
    </div>
  );
}
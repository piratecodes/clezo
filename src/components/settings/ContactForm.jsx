import { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Share2, Loader2 } from 'lucide-react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';

export default function ContactForm({ initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    primaryPhone: '', whatsappNumber: '', alternatePhone: '',
    supportEmail: '', salesEmail: '',
    headOfficeAddress: '', googleMapsLink: '',
    facebookUrl: '', instagramUrl: '', twitterUrl: '', linkedinUrl: ''
  });

  // Load the data from the database into the form
  useEffect(() => {
    if (initialData) {
      setFormData({
        primaryPhone: initialData.primaryPhone || '',
        whatsappNumber: initialData.whatsappNumber || '',
        alternatePhone: initialData.alternatePhone || '',
        supportEmail: initialData.supportEmail || '',
        salesEmail: initialData.salesEmail || '',
        headOfficeAddress: initialData.headOfficeAddress || '',
        googleMapsLink: initialData.googleMapsLink || '',
        facebookUrl: initialData.facebookUrl || '',
        instagramUrl: initialData.instagramUrl || '',
        twitterUrl: initialData.twitterUrl || '',
        linkedinUrl: initialData.linkedinUrl || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Hit your updateContactInfo controller! (Assuming your route is PUT or PATCH /contact)
      await fetchClient('/contact', {
        method: 'PATCH', // Or PUT, depending on your exact route setup
        body: JSON.stringify(formData)
      });
      toast.success('Company settings updated securely');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
      
      {/* SECTION 1: Phone Numbers */}
      <div className="bg-on-primary-fixed/60 backdrop-blur-3xl p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[50px] pointer-events-none -z-10 group-hover:bg-primary/20 transition-all duration-700"></div>
        <h2 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2 drop-shadow-md relative z-10">
          <Phone className="text-primary" /> Master Contact Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Primary Phone <span className="text-primary">*</span></label>
            <input type="text" name="primaryPhone" required value={formData.primaryPhone} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">WhatsApp Number</label>
            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Alternate Phone</label>
            <input type="text" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="Landline or secondary" />
          </div>
        </div>
      </div>

      {/* SECTION 2: Email Addresses */}
      <div className="bg-on-primary-fixed/60 backdrop-blur-3xl p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[50px] pointer-events-none -z-10 group-hover:bg-primary/20 transition-all duration-700"></div>
        <h2 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2 drop-shadow-md relative z-10">
          <Mail className="text-primary" /> Email Routing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Support / General Email <span className="text-primary">*</span></label>
            <input type="email" name="supportEmail" required value={formData.supportEmail} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="support@clezo.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Sales / Quotes Email</label>
            <input type="email" name="salesEmail" value={formData.salesEmail} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="sales@clezo.com" />
          </div>
        </div>
      </div>

      {/* SECTION 3: Office Location */}
      <div className="bg-on-primary-fixed/60 backdrop-blur-3xl p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-48 h-48 bg-primary/10 blur-[50px] pointer-events-none -z-10 group-hover:bg-primary/20 transition-all duration-700"></div>
        <h2 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2 drop-shadow-md relative z-10">
          <MapPin className="text-primary" /> Physical Headquarters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-300 mb-1">Head Office Address <span className="text-primary">*</span></label>
            <textarea name="headOfficeAddress" required rows="2" value={formData.headOfficeAddress} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="Full street address, city, state, PIN" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-300 mb-1">Google Maps Embed Link</label>
            <input type="url" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="https://maps.google.com/..." />
          </div>
        </div>
      </div>

      {/* SECTION 4: Social Media */}
      <div className="bg-on-primary-fixed/60 backdrop-blur-3xl p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[50px] pointer-events-none -z-10 group-hover:bg-primary/20 transition-all duration-700"></div>
        <h2 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2 drop-shadow-md relative z-10">
          <Share2 className="text-primary" /> Social Media Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Facebook URL</label>
            <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="https://facebook.com/clezo" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Instagram URL</label>
            <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="https://instagram.com/clezo" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Twitter (X) URL</label>
            <input type="url" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="https://twitter.com/..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">LinkedIn URL</label>
            <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-slate-500 outline-none" placeholder="https://linkedin.com/company/..." />
          </div>
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 z-[60] bg-on-primary-fixed/80 backdrop-blur-3xl p-4 rounded-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-between">
        <div>
          <p className="font-extrabold text-white drop-shadow-md">Save Changes</p>
          <p className="text-xs text-slate-400 font-medium">This updates the frontend website immediately.</p>
        </div>
        <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-fixed-variant disabled:bg-primary/50 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5">
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Update Global Settings
        </button>
      </div>
    </form>
  );
}
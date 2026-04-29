import React, { useState, useEffect, useCallback } from "react";
import { Building2, Mail, Phone, Globe, MapPin, Save, Loader2 } from "lucide-react";
import { getSchoolById, updateSchool } from "../../services/api/adminService.js";
import { toast } from "react-toastify";
import { getStoredUser } from "../../services/storage/storageService.js";

const SchoolDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [schoolId, setSchoolId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    zipCode: "",
    webpage: "",
    email: "",
    phoneNumber: ""
  });

  // Get user on component mount
  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);

  const fetchSchoolData = useCallback(async (id) => {
    try {
      setLoading(true);
      const schoolData = await getSchoolById(id);
      
      const elerhetoseg = schoolData.elerhetosegek?.[0] || {};
      setFormData({
        name: schoolData.name || "",
        address: schoolData.address || "",
        zipCode: schoolData.zipCode || "",
        webpage: schoolData.webpage || "",
        email: elerhetoseg.email || "",
        phoneNumber: elerhetoseg.phoneNumber || ""
      });
    } catch (error) {
      toast.error(error.message || "Hiba az iskola adatainak betöltésekor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "school") {
      // Fetch the user's specific details from the backend to get the managedSchool ID
      const fetchUserProfile = async () => {
        try {
          // Import the authenticated api instance dynamically or use the one from adminService if possible.
          // Actually, we can just use the standard api instance from authService.
          const { api } = await import("../../services/api/authService.js");
          const response = await api.get(`/user/${user.id}`);
          const userData = response.data;
          
          if (userData.managedSchool) {
            setSchoolId(userData.managedSchool);
            fetchSchoolData(userData.managedSchool);
          } else {
            toast.error("Nincs hozzád rendelve iskola!");
            setLoading(false);
          }
        } catch (error) {
          toast.error("Nem sikerült azonosítani az iskoládat");
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  }, [user, fetchSchoolData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!schoolId) return;
    
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        address: formData.address,
        zipCode: formData.zipCode,
        webpage: formData.webpage,
        elerhetosegek: [{
           email: formData.email,
           phoneNumber: formData.phoneNumber
        }]
      };

      await updateSchool(schoolId, payload);
      toast.success("Az iskola adatai sikeresen frissítve!");
    } catch (error) {
      toast.error(error.message || "Hiba a mentés során");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#F6C90E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!schoolId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Building2 size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Nincs iskola hozzárendelve</h2>
        <p className="text-gray-500 max-w-md mt-2">
          Jelenleg nincs egyetlen autósiskola sem a fiókodhoz rendelve. 
          Kérjük, vedd fel a kapcsolatot a platform üzemeltetőivel.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bento */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F6C90E]/20 rounded-2xl flex items-center justify-center border border-[#F6C90E]/30">
              <Building2 size={32} className="text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Iskolám Kezelése
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                A(z) <span className="font-bold text-gray-900">{formData.name}</span> adatainak módosítása
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MapPin className="text-[#F6C90E]" />
          Alapadatok
        </h2>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Iskola neve</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Irányítószám</label>
              <input
                type="text"
                name="zipCode"
                required
                pattern="\d{4}"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cím (utca, házszám)</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="text-[#F6C90E]" />
                Elérhetőségek
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} className="text-gray-400" /> Email cím
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} className="text-gray-400" /> Telefonszám
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Globe size={16} className="text-gray-400" /> Weboldal (URL)
              </label>
              <input
                type="text"
                name="webpage"
                value={formData.webpage}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
                placeholder="https://www.iskola.hu"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-[#F6C90E] text-slate-900 font-bold hover:bg-yellow-400 rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              Változások mentése
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolDashboard;

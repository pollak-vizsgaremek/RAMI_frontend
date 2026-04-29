import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin
} from "lucide-react";
import {
  getSchoolsList,
  updateSchool,
  deleteSchool,
  registerSchool
} from "../../services/api/adminService.js";
import { toast } from "react-toastify";

const AdminSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    address: "",
    zipCode: "",
    webpage: "",
    email: "",
    phoneNumber: "",
    adminEmail: ""
  });

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSchoolsList();
      setSchools(data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      _id: "",
      name: "",
      address: "",
      zipCode: "",
      webpage: "",
      email: "",
      phoneNumber: "",
      adminEmail: ""
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (school) => {
    setModalMode("edit");
    const elerhetoseg = school.elerhetosegek?.[0] || {};
    setFormData({
      _id: school._id,
      name: school.name || "",
      address: school.address || "",
      zipCode: school.zipCode || "",
      webpage: school.webpage || "",
      email: elerhetoseg.email || "",
      phoneNumber: elerhetoseg.phoneNumber || "",
      adminEmail: "" // We usually don't edit this here
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        zipCode: formData.zipCode,
        webpage: formData.webpage,
        elerhetosegek: [{
           email: formData.email,
           phoneNumber: formData.phoneNumber
        }],
        categories: [], // Can be expanded later
        instructors: [], // Can be expanded later
        ...(modalMode === "create" && { adminEmail: formData.adminEmail })
      };

      if (modalMode === "create") {
        await registerSchool(payload);
        toast.success("Iskola sikeresen létrehozva");
      } else {
        await updateSchool(formData._id, payload);
        toast.success("Iskola sikeresen frissítve");
      }
      setShowModal(false);
      fetchSchools();
    } catch (error) {
      toast.error(error.message || "Hiba a mentés során");
    }
  };

  const handleDelete = async (schoolId) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt az iskolát? Ez a művelet nem vonható vissza.")) return;
    try {
      await deleteSchool(schoolId);
      toast.success("Iskola törölve");
      fetchSchools();
    } catch (error) {
      toast.error(error.message || "Hiba a törlés során");
    }
  };

  const filteredSchools = schools.filter((school) =>
    school.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#F6C90E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                Iskolák Kezelése
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Autósiskolák regisztrációja és szerkesztése ({schools.length} iskola)
              </p>
            </div>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#F6C90E] text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all hover:-translate-y-1 shadow-lg shadow-yellow-500/30">
            <Plus size={20} />
            Új Iskola Hozzáadása
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Keresés iskola neve alapján..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Schools List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchools.map((school) => {
          const elerhetoseg = school.elerhetosegek?.[0] || {};
          return (
            <div
              key={school._id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Building2 size={24} className="text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#F6C90E] transition-colors line-clamp-1">
                      {school.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(school)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Szerkesztés">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(school._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Törlés">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-3 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{school.zipCode} {school.address}</span>
                </div>
                
                {elerhetoseg.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-3 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{elerhetoseg.email}</span>
                  </div>
                )}
                
                {elerhetoseg.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-3 text-gray-400 flex-shrink-0" />
                    <span>{elerhetoseg.phoneNumber}</span>
                  </div>
                )}
                
                {school.webpage && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe size={16} className="mr-3 text-gray-400 flex-shrink-0" />
                    <a href={school.webpage.startsWith('http') ? school.webpage : `https://${school.webpage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                      {school.webpage}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredSchools.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nincsenek iskolák
            </h3>
            <p className="text-gray-500">
              Nem találtunk a keresésnek megfelelő autósiskolát.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === "create" ? "Új iskola regisztrálása" : "Iskola szerkesztése"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {modalMode === "create" && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm mb-6">
                  <p>
                    <strong>Fontos:</strong> Egy iskola regisztrációjához szükséges egy hitelesített felhasználói fiók (email cím). Ez a felhasználó kapja meg az iskola adminisztrációs jogait.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modalMode === "create" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kezelő felhasználó email címe (kötelező)</label>
                    <input
                      type="email"
                      required
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
                      placeholder="admin@iskola.hu"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Iskola neve</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
                    placeholder="Pl. Csigavér Autósiskola"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Irányítószám</label>
                  <input
                    type="text"
                    required
                    pattern="\d{4}"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
                    placeholder="1011"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cím (utca, házszám)</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
                    placeholder="Pl. Fő utca 12."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email cím</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
                    placeholder="info@iskola.hu"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefonszám</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
                    placeholder="+36301234567"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weboldal (URL)</label>
                  <input
                    type="text"
                    value={formData.webpage}
                    onChange={(e) => setFormData({ ...formData, webpage: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C90E] focus:border-transparent outline-none transition-all"
                    placeholder="https://www.iskola.hu"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
                  Mégse
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F6C90E] text-slate-900 font-bold hover:bg-yellow-400 rounded-xl transition-colors">
                  {modalMode === "create" ? "Regisztráció" : "Mentés"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchools;

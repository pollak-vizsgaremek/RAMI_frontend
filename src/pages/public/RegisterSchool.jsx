import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../../services/api/authService.js";
import { toast } from "react-toastify";

export default function RegisterSchool({ onClose }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [contacts, setContacts] = useState([""]);
  const [webpage, setWebpage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        const data = res.data;
        // find first array in response
        const findFirstArray = (obj) => {
          if (!obj) return null;
          if (Array.isArray(obj)) return obj;
          if (typeof obj !== "object") return null;
          for (const key of Object.keys(obj)) {
            try {
              const val = obj[key];
              if (Array.isArray(val)) return val;
              if (typeof val === "object") {
                const nested = findFirstArray(val);
                if (Array.isArray(nested)) return nested;
              }
            } catch (e) {}
          }
          return null;
        };

        const arr = findFirstArray(data);
        setCategories(Array.isArray(arr) ? arr : Array.isArray(data) ? data : []);
        setCategoriesError("");
      } catch (err) {
        setCategories([]);
        setCategoriesError(err.response?.data?.message || err.message || "Hiba a kategóriák betöltésekor");
      }
    };

    fetchCategories();
  }, []);

  const isValidUrl = (str) => {
    if (!str) return true;
    try {
      // eslint-disable-next-line no-new
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isFormValid = () => {
    if (!name || name.trim().length < 2 || name.trim().length > 100) return false;
    if (!address || address.trim().length < 5 || address.trim().length > 200) return false;
    if (!/^\d{4}$/.test(zipCode.trim())) return false;
    // all contact entries must be non-empty
    if (!contacts.length || contacts.some((c) => !c || !c.trim())) return false;
    if (webpage && !isValidUrl(webpage)) return false;
    if (!selectedCategories.length) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return toast.error("Kérjük töltsd ki a kötelező mezőket helyesen.");
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        address: address.trim(),
        zipCode: zipCode.trim(),
        elerhetosegek: contacts.map((p) => ({ phoneNumber: p.trim() })),
        webpage: webpage ? webpage.trim() : undefined,
        categories: selectedCategories.length ? selectedCategories : undefined,
      };

      await api.post("/school/register", payload);

      toast.success("Iskola sikeresen regisztrálva.");
      setTimeout(() => {
        if (onClose) onClose();
        navigate("/");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Regisztráció sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="w-full max-w-lg">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Iskola regisztráció</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Név *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={100} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Cím *</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} required minLength={5} maxLength={200} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Irányítószám * (pontosan 4 számjegy)</label>
              <input 
                type="text"
                value={zipCode} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,4}$/.test(val)) {
                    setZipCode(val);
                  }
                }} 
                required 
                maxLength={4} 
                inputMode="numeric"
                placeholder="pl. 1234"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" 
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Elérhetőségek (telefonszámok) *</label>
              {contacts.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input value={c} onChange={(e) => setContacts((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))} required className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600" />
                  <button type="button" onClick={() => setContacts((prev) => prev.filter((_, i) => i !== idx))} className="text-red-400">Töröl</button>
                </div>
              ))}
              <button type="button" onClick={() => setContacts((prev) => [...prev, ""]) } className="text-[#F6C90E]">Új elérhetőség hozzáadása</button>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Weboldal (opcionális)</label>
              <input value={webpage} onChange={(e) => setWebpage(e.target.value)} placeholder="https://example.com" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
              {webpage && !isValidUrl(webpage) && <div className="text-red-400 text-sm mt-1">Érvénytelen URL.</div>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Kategóriák *</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.length === 0 && !categoriesError && <div className="text-gray-400">Kategóriák betöltése...</div>}
                {categoriesError && <div className="text-red-400">{categoriesError}</div>}
                {categories.map((c) => {
                  const id = c && typeof c === 'object' ? (c.id || c._id || c.value || c.key) : c;
                  const label = c && typeof c === 'object' ? (c.name || c.label || String(c)) : c;
                  const checked = selectedCategories.includes(String(id));

                  return (
                    <label key={id} className="flex items-center space-x-2 text-gray-200">
                      <input
                        type="checkbox"
                        value={id}
                        checked={checked}
                        onChange={(e) => {
                          const val = String(e.target.value);
                          setSelectedCategories((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
                        }}
                        className="w-4 h-4"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button type="submit" disabled={loading} className="bg-[#F6C90E] text-black px-4 py-2 rounded font-semibold disabled:opacity-60">
                {loading ? "Küldés..." : "Regisztrálás"}
              </button>
              <button type="button" onClick={() => { if (onClose) onClose(); navigate('/'); }} className="text-gray-300 underline">Mégse</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

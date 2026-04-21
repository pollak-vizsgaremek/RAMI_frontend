import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../../services/api/authService.js";
import { toast } from "react-toastify";

export default function RegisterInstructor({ onClose }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await api.get("/school/names");
        const data = res.data;
        if (Array.isArray(data)) setSchools(data);
        else if (Array.isArray(data.schools)) setSchools(data.schools);
        else if (Array.isArray(data.data)) setSchools(data.data);
      } catch (err) {
        console.error("Failed to load school names:", err);
        setSchools([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        const data = res.data;

        // helper: find first array anywhere in the response object
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
            } catch (e) {
              // ignore
            }
          }
          return null;
        };

        const arr = findFirstArray(data);
        // normalize response into an array if possible
        if (Array.isArray(arr)) {
          setCategories(arr);
        } else {
          // fallback: if data itself is array handled above, otherwise empty
          setCategories(Array.isArray(data) ? data : []);
        }
        setCategoriesError("");
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories([]);
        setCategoriesError(err.response?.data?.message || err.message || "Hiba a kategóriák betöltésekor");
      }
    };

    fetchSchools();
    fetchCategories();
  }, []);

  const isFormValid =
    name.trim() &&
    age &&
    email.includes("@") &&
    password.length >= 6 &&
    phoneNumber.trim() &&
    selectedSchool &&
    city.trim() &&
    experience !== "" &&
    !Number.isNaN(Number(experience)) &&
    Number(experience) >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return toast.error("Kérjük töltsd ki a kötelező mezőket.");
    setLoading(true);

    try {
      await api.post("/auth/register-instructor", {
        name,
        age,
        email,
        password,
        phoneNumber,
        hobbies: hobbies || undefined,
        school: selectedSchool,
        city,
        experience: Number(experience),
        categories: selectedCategories.length ? selectedCategories : undefined,
      });

      toast.success("Sikeres jelentkezés!Kérünk igazold vissza az e-mail címedet. Hamarosan felvesszük Veled a kapcsolatot.");
      setTimeout(() => {
        if (onClose) onClose();
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Regisztráció sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="w-full max-w-lg">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Oktató jelentkezés</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Név *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Kor (év) *</label>
                <input type="number" min="18" value={age} onChange={(e) => setAge(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">E-mail *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Jelszó *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Telefonszám *</label>
                <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Hobbi (opcionális)</label>
              <input value={hobbies} onChange={(e) => setHobbies(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Iskola *</label>
                  <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600">
                    <option value="">-- Válassz iskolát --</option>
                    {schools.length === 0 && <option disabled>Betöltés...</option>}
                    {schools.map((s, i) => {
                      const id = s && typeof s === 'object' ? (s.id || s._id || s.value || s.key) : s;
                      const label = s && typeof s === 'object' ? (s.name || s.label || String(s)) : s;
                      return (
                        <option key={i} value={id}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Város *</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Tapasztalat (év) *</label>
              <input
                type="number"
                min="0"
                step="1"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                placeholder="Hány éve oktatsz?"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Kategóriák (pipáld ki, melyeket oktatsz)</label>
              <div className="grid grid-cols-2 gap-2 pr-2">
                {categories.length === 0 && !categoriesError && <div className="text-gray-400">Kategóriák betöltése...</div>}
                {categoriesError && <div className="text-red-400">{categoriesError}</div>}
                {/* removed raw debug output */}
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
                          setSelectedCategories((prev) =>
                            prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val],
                          );
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
                {loading ? "Küldés..." : "Jelentkezés"}
              </button>
              <button type="button" onClick={() => { if (onClose) onClose(); navigate('/'); }} className="text-gray-300 underline">Mégse</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

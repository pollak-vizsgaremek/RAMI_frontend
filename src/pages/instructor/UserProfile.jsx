import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { api } from "../../services/api/authService.js";
import { toast } from "react-toastify";
import {
  getToken,
  getStoredUser,
} from "../../services/storage/storageService.js";
import { Camera, Loader2 } from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", phoneNumber: "" });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const [myReviews, setMyReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Kérlek, jelentkezz be a profilod megtekintéséhez.");
      navigate("/");
      return;
    }

    const user = getStoredUser();
    const name = user?.name || "Ismeretlen Felhasználó";
    const email = user?.email || "";
    const phone = user?.phoneNumber || user?.phone || "";
    const role = user?.role || "student";
    const instructorId = user?.instructorId;
    setUserData({ name, email, phone, id: user?.id, role, instructorId });
    setEditForm({ email, phoneNumber: phone });

    // Load existing profile image
    if (user?.id) {
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }

      const endpoint = role === "instructor"
        ? `/instructor/${instructorId || user.id}`
        : `/user/${user.id}`;

      api.get(endpoint).then((res) => {
        if (res.data) {
          if (res.data.profileImage) {
            setProfileImage(res.data.profileImage);
          }

          const email = res.data.email || "";
          const phone = res.data.phoneNumber || "";

          setUserData(prev => ({ ...prev, email, phone }));
          setEditForm({ email, phoneNumber: phone });

          // Also sync with storage just in case
          const storedUser = getStoredUser();
          if (storedUser) {
            if (res.data.profileImage) storedUser.profileImage = res.data.profileImage;
            storedUser.email = email;
            storedUser.phoneNumber = phone;
            localStorage.setItem("user", JSON.stringify(storedUser));
            if (res.data.profileImage) sessionStorage.setItem("userProfileImage", res.data.profileImage);
          }
        }
      }).catch(() => { });
    }

    const fetchMyReviews = async () => {
      try {
        const userId = user?.id;
        const res = await api.get(`/review/user/${userId}`);
        setMyReviews(res.data);
      } catch (err) {
        console.error("Nem sikerült betölteni az értékeléseket:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchMyReviews();

    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A kép mérete maximum 2MB lehet!");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Csak képfájlt tölthetsz fel!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      setUploadingImage(true);
      try {
        const storedUser = getStoredUser();
        const isInstructor = storedUser?.role === "instructor";
        const instructorId = storedUser?.instructorId || userData.instructorId || userData.id;
        const endpoint = isInstructor
          ? `/instructor/${instructorId}/profile-image`
          : `/user/${userData.id}/profile-image`;

        const res = await api.post(endpoint, {
          profileImage: base64,
        });
        setProfileImage(res.data.profileImage);

        // Update local storage so Navbar sees it
        storedUser.profileImage = res.data.profileImage;
        localStorage.setItem("user", JSON.stringify(storedUser));
        sessionStorage.setItem("userProfileImage", res.data.profileImage);
        window.dispatchEvent(new Event("authChange"));

        toast.success("Profilkép sikeresen feltöltve!");
      } catch (err) {
        toast.error(err.response?.data?.error || "Hiba a feltöltés közben.");
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt az értékelést? Ezt nem lehet visszavonni.")) {
      return;
    }
    try {
      await api.delete(`/review/${reviewId}`);
      setMyReviews(myReviews.filter((review) => review._id !== reviewId));
      toast.success("Értékelés sikeresen törölve!");
    } catch (error) {
      console.error("Hiba törléskor:", error);
      toast.error("Nem sikerült törölni az értékelést.");
    }
  };

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      const storedUser = getStoredUser();
      const isInstructor = storedUser?.role === "instructor";
      const instructorId = storedUser?.instructorId || userData.instructorId || userData.id;
      const endpoint = isInstructor
        ? `/instructor/${instructorId}`
        : `/user/${userData.id}`;

      const res = await api.put(endpoint, {
        email: editForm.email,
        phoneNumber: editForm.phoneNumber.trim() === "" ? null : editForm.phoneNumber.trim()
      });

      setUserData(prev => ({
        ...prev,
        email: res.data.email,
        phone: res.data.phoneNumber
      }));

      // Update local storage
      storedUser.email = res.data.email;
      storedUser.phoneNumber = res.data.phoneNumber;
      localStorage.setItem("user", JSON.stringify(storedUser));
      window.dispatchEvent(new Event("authChange"));

      setIsEditing(false);
      toast.success("Elérhetőségek sikeresen frissítve!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Hiba a mentés során.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col">
      <div
        className={`w-full rounded-4xl p-8 md:p-12 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative text-white overflow-hidden group transform transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10 group-hover:opacity-20 transition-all duration-500"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            {/* Profile Image */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto md:mx-0">
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg bg-white/5">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profilkép"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                    <Camera size={40} className="text-gray-600" />
                    <span className="text-sm font-medium">Nincs profilkép</span>
                  </div>
                )}
              </div>
              {/* Upload overlay button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute bottom-3 right-3 bg-[#F6C90E] hover:bg-yellow-400 text-black rounded-xl p-2.5 shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-60"
                title="Profilkép módosítása">
                {uploadingImage ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Camera size={18} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center md:text-left">
              Max. 2MB · JPG, PNG, WEBP
            </p>
          </div>

          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-start">
            <div className="mb-6">
              <span className="bg-[#F6C90E]/20 text-[#F6C90E] border border-[#F6C90E]/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                {userData.role === "instructor" ? "Oktató" : userData.role === "admin" || userData.role === "creator" ? "Adminisztrátor" : userData.role === "school" ? "Autósiskola" : "Tanuló"}
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-2">
                {userData.name}
              </h2>
              <p className="opacity-90 font-medium text-gray-400 text-lg">
                {userData.role === "instructor" ? "Regisztrált oktató" : userData.role === "admin" || userData.role === "creator" ? "Rendszergazda" : userData.role === "school" ? "Iskola fiók" : "Regisztrált tag"}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col gap-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xl font-bold text-white">Elérhetőségek</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#F6C90E] hover:text-yellow-400 uppercase tracking-widest transition-colors cursor-pointer">
                Módosítás
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ email: userData.email, phoneNumber: userData.phone });
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer">
                  Mégse
                </button>
                <button
                  onClick={handleSaveContact}
                  disabled={saving}
                  className="text-xs font-bold text-[#F6C90E] hover:text-yellow-400 uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50">
                  {saving ? "Mentés..." : "Mentés"}
                </button>
              </div>
            )}
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
            {!isEditing ? (
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    E-mail
                  </h4>
                  <a
                    href={`mailto:${userData.email}`}
                    className="font-medium text-[#F6C90E] hover:underline text-lg transition-all break-all drop-shadow-md">
                    {userData.email || "Nincs megadva"}
                  </a>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Telefon
                  </h4>
                  <a
                    href={userData.phone ? `tel:${userData.phone}` : "#"}
                    className={`font-medium text-lg transition-colors ${userData.phone ? "text-white hover:text-[#F6C90E]" : "text-gray-500 cursor-default"}`}>
                    {userData.phone || "Nincs megadva"}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    E-mail
                  </h4>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F6C90E] transition-colors"
                    placeholder="E-mail cím"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Telefon
                  </h4>
                  <input
                    type="text"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#F6C90E] transition-colors"
                    placeholder="Telefonszám (pl. +36201234567)"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col gap-5">
          <h3 className="text-xl font-bold text-white px-1">
            Saját Értékeléseim
          </h3>

          {loadingReviews ? (
            <div className="text-gray-400 font-medium text-sm p-4 text-center">
              Értékelések betöltése...
            </div>
          ) : myReviews.length === 0 ? (
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-4">
                Még nem írtál egyetlen értékelést sem.
              </p>
              <button
                onClick={() => navigate("/review")}
                className="bg-gray-700 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-600 transition-colors cursor-pointer">
                Értékelés írása
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myReviews.map((review) => {
                const myRating =
                  review.rating && review.rating[0] ? review.rating[0] : review;
                const t = Number(myRating.turelem) || 0;
                const s = Number(myRating.szaktudas) || 0;
                const k = Number(myRating.kommunikacio) || 0;
                const rug = Number(myRating.rugalmasag) || 0;

                if (t === 0 && s === 0 && k === 0 && rug === 0 && !myRating.tapasztalat)
                  return null;
                const avg = ((t + s + k + rug) / 4).toFixed(1);

                return (
                  <div
                    key={review._id}
                    className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-[#F6C90E]/30 transition-colors relative">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2 cursor-pointer"
                      title="Értékelés törlése">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>

                    <div className="flex justify-between items-start mb-3 pr-10">
                      <h4 className="font-bold text-lg text-white">
                        {review.instructor?.name || "Ismeretlen Oktató"}
                      </h4>
                      <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-[#F6C90E]">
                        Átlag: {avg} ★
                      </span>
                    </div>
                    {myRating.tapasztalat && (
                      <p className="text-gray-400 text-sm mb-4 italic">
                        "{myRating.tapasztalat}"
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500 uppercase tracking-wider font-bold">
                      <div>Türelem: <span className="text-white">{t}</span></div>
                      <div>Szaktudás: <span className="text-white">{s}</span></div>
                      <div>Kommunikáció: <span className="text-white">{k}</span></div>
                      <div>Rugalmaság: <span className="text-white">{rug}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
// React Icons
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineSafety,
  AiOutlineLock,
  AiOutlineClose,
  AiOutlineUserAdd,
  AiOutlineEdit,
  AiOutlineLoading3Quarters,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlinePhone,
  AiOutlineBank,
  AiOutlineCheckCircle,
} from "react-icons/ai";

function UserFormModal({ isOpen, onClose, userId, isEditMode }) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    phone: "",
    avatarUrl: "",
    profil: "user",
    departement: "",
    isActive: true,
    isVerified: false,
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "departements"));
        const departmentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nomDepartement: doc.data().nomDepartement || doc.data().nom || "Département",
        }));
        setDepartments(departmentsList);
      } catch (err) {
        console.error("Erreur lors du chargement des départements:", err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (isEditMode && userId) {
      const fetchUser = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFormData({
              nom: data.nom || "",
              email: data.email || "",
              phone: data.phone || "",
              avatarUrl: data.avatarUrl || "",
              profil: data.profil || "user",
              departement: data.departement || "",
              isActive: data.isActive !== undefined ? data.isActive : true,
              isVerified: data.isVerified !== undefined ? data.isVerified : false,
            });
          } else {
            setError("Utilisateur non trouvé.");
          }
        } catch (err) {
          console.error("Erreur lors du chargement des données:", err);
          setError("Erreur lors du chargement des données.");
        }
      };
      fetchUser();
    }
  }, [isEditMode, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = {
        nom: formData.nom,
        email: formData.email,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl,
        profil: formData.profil,
        departement: formData.departement,
        isActive: formData.isActive,
        isVerified: formData.isVerified,
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode) {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, userData, { merge: true });
      } else {
        userData.createdAt = new Date().toISOString();
        userData.firstConnect = true;
        
        const response = await fetch(
          "https://createuserbyadmin-rjxvamxmxa-uc.a.run.app",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              displayName: formData.nom,
              ...userData,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Erreur lors de la création de l'utilisateur"
          );
        }

        console.log("✅ Utilisateur créé avec succès:", result);
      }
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      let errorMessage = "Erreur lors de l'enregistrement.";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "Cet email est déjà utilisé.";
          break;
        case "auth/invalid-email":
          errorMessage = "Email invalide.";
          break;
        case "auth/weak-password":
          errorMessage = "Mot de passe trop faible (minimum 6 caractères).";
          break;
        case "permission-denied":
          errorMessage = "Autorisations insuffisantes.";
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="sidebar-border bg-white rounded-2xl w-full max-w-2xl shadow-soft-3xl animate-scale-in mx-4">
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="sidebar-icon shadow-soft-2xl flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                {isEditMode ? (
                  <AiOutlineEdit className="w-6 h-6 text-white" />
                ) : (
                  <AiOutlineUserAdd className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight font-poppins">
                  {isEditMode ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                </h2>
                <p className="text-orange-100 text-sm font-medium">
                  {isEditMode
                    ? "Mettre à jour les informations utilisateur"
                    : "Créer un nouveau compte utilisateur"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="sidebar-item p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
            >
              <AiOutlineClose className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <AiOutlineUser className="w-4 h-4" />
                  <span>Nom complet</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="sidebar-item w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 text-sm font-medium text-slate-700 bg-white"
                  placeholder="Saisir le nom complet"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <AiOutlineMail className="w-4 h-4" />
                  <span>Adresse email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="sidebar-item w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 text-sm font-medium text-slate-700 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="exemple@email.com"
                  required
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="text-xs text-slate-500 flex items-center space-x-1 font-medium">
                    <AiOutlineLock className="w-3 h-3" />
                    <span>Email non modifiable</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <AiOutlinePhone className="w-4 h-4" />
                  <span>Téléphone</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="sidebar-item w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 text-sm font-medium text-slate-700 bg-white"
                  placeholder="+225 XX XX XX XX XX"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <AiOutlineBank className="w-4 h-4" />
                  <span>Département</span>
                </label>
                <select
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                  className="sidebar-item w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 text-sm font-medium text-slate-700 bg-white"
                  required
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nomDepartement}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <AiOutlineSafety className="w-4 h-4" />
                  <span>Profil utilisateur</span>
                </label>
                <select
                  name="profil"
                  value={formData.profil}
                  onChange={handleChange}
                  className="sidebar-item w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 text-sm font-medium text-slate-700 bg-white"
                  required
                >
                  <option value="user">👤 Utilisateur</option>
                  <option value="technicien">🔧 Technicien</option>
                  <option value="superviseur">👷 Superviseur</option>
                  <option value="soc">🛡️ SOC</option>
                  <option value="admin">⚡ Administrateur</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <AiOutlineUser className="w-4 h-4" />
                  <span>URL Avatar (optionnel)</span>
                </label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="sidebar-item w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 text-sm font-medium text-slate-700 bg-white"
                  placeholder="https://exemple.com/avatar.jpg"
                />
              </div>

              {!isEditMode && (
                <div className="col-span-2">
                  <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <AiOutlineLock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900">
                        Mot de passe généré automatiquement
                      </p>
                      <p className="text-xs text-orange-700 font-medium">
                        Un mot de passe sécurisé sera généré et envoyé par email à l'utilisateur
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-span-2 space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  {formData.isActive ? (
                    <AiOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AiOutlineCheckCircle className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Statut du compte</span>
                </label>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 shadow-soft-xl ${
                      formData.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-soft-xl ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <div className="flex-1">
                    <span className={`text-sm font-semibold ${formData.isActive ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {formData.isActive ? 'Compte actif' : 'Compte désactivé'}
                    </span>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {formData.isActive 
                        ? 'L\'utilisateur peut se connecter à l\'application' 
                        : 'L\'utilisateur ne peut pas se connecter à l\'application'}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="col-span-2 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              )}

              <div className="col-span-2 flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="sidebar-item px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-300 text-sm font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="sidebar-item flex items-center space-x-2 px-6 py-3 bg-gradient-to-tl from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-soft-xl hover:shadow-soft-2xl hover:scale-105 text-sm font-semibold"
                >
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <AiOutlineEdit className="w-5 h-5" />
                      ) : (
                        <AiOutlineUserAdd className="w-5 h-5" />
                      )}
                      <span>Enregistrer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}

export default UserFormModal;

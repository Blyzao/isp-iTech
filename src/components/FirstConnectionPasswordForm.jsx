import React, { useState } from "react";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
// React Icons
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineSafety,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineLoading3Quarters,
  AiOutlineKey,
  AiOutlineSetting,
} from "react-icons/ai";
import Card, { CardBody } from "./ui/Card";
import Button from "./ui/Button";

function FirstConnectionPasswordForm({ user, onComplete }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { regex: /.{8,}/, text: "Au moins 8 caractères" },
    { regex: /[A-Z]/, text: "Au moins une majuscule" },
    { regex: /[a-z]/, text: "Au moins une minuscule" },
    { regex: /[0-9]/, text: "Au moins un chiffre" },
    { regex: /[^A-Za-z0-9]/, text: "Au moins un caractère spécial" },
  ];

  const checkPasswordRequirement = (password, regex) => {
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation des champs requis
    if (!formData.currentPassword) {
      setError("Le mot de passe actuel est requis.");
      setLoading(false);
      return;
    }

    // Validation des mots de passe
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    // Vérification des exigences de mot de passe
    const allRequirementsMet = passwordRequirements.every((req) =>
      checkPasswordRequirement(formData.newPassword, req.regex)
    );

    if (!allRequirementsMet) {
      setError("Le mot de passe ne respecte pas toutes les exigences de sécurité.");
      setLoading(false);
      return;
    }

    try {
      // Ré-authentification avec le mot de passe actuel
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Mise à jour du mot de passe dans Firebase Auth
      await updatePassword(user, formData.newPassword);

      // Mise à jour du champ firstConnect dans Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstConnect: false,
      });

      onComplete();
    } catch (err) {
      console.error("Erreur lors du changement de mot de passe:", err);
      let errorMessage = "Erreur lors du changement de mot de passe.";
      
      switch (err.code) {
        case "auth/weak-password":
          errorMessage = "Le mot de passe est trop faible.";
          break;
        case "auth/requires-recent-login":
          errorMessage = "Veuillez vous reconnecter et réessayer.";
          break;
        case "auth/wrong-password":
          errorMessage = "Le mot de passe actuel est incorrect.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Le mot de passe actuel est incorrect.";
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden" shadow="soft-2xl">
        {/* Header avec gradient iTech */}
        <div className="bg-gradient-to-tl from-blue-600 to-cyan-400 px-8 py-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="inline-block p-3 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
              <AiOutlineKey className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Configuration Initiale</h1>
            <p className="text-blue-100 text-sm font-medium mb-1">
              iTech - Gestion Intelligente des Équipements
            </p>
            <p className="text-blue-200/80 text-xs">
              Définissez un nouveau mot de passe sécurisé pour votre première connexion
            </p>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Colonne des champs */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-1 text-sm font-medium text-gray-700 mb-2">
                    <AiOutlineLock className="w-4 h-4" />
                    <span>Mot de passe actuel</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-lg border border-gray-300 bg-white bg-clip-padding px-3 py-2 pr-10 font-normal text-gray-700 transition-all focus:outline-none focus:transition-shadow text-sm leading-5.6 ease-soft focus:border-blue-300 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
                      placeholder="Saisir le mot de passe actuel"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showCurrentPassword ? (
                        <AiOutlineEyeInvisible className="w-4 h-4" />
                      ) : (
                        <AiOutlineEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-1 text-sm font-medium text-gray-700 mb-2">
                    <AiOutlineLock className="w-4 h-4" />
                    <span>Nouveau mot de passe</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-lg border border-gray-300 bg-white bg-clip-padding px-3 py-2 pr-10 font-normal text-gray-700 transition-all focus:outline-none focus:transition-shadow text-sm leading-5.6 ease-soft focus:border-blue-300 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
                      placeholder="Saisir le nouveau mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showNewPassword ? (
                        <AiOutlineEyeInvisible className="w-4 h-4" />
                      ) : (
                        <AiOutlineEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-1 text-sm font-medium text-gray-700 mb-2">
                    <AiOutlineLock className="w-4 h-4" />
                    <span>Confirmer le mot de passe</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-lg border border-gray-300 bg-white bg-clip-padding px-3 py-2 pr-10 font-normal text-gray-700 transition-all focus:outline-none focus:transition-shadow text-sm leading-5.6 ease-soft focus:border-blue-300 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
                      placeholder="Confirmer le nouveau mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible className="w-4 h-4" />
                      ) : (
                        <AiOutlineEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Colonne des exigences */}
              <div className="space-y-4">
                {/* Exigences de mot de passe */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                    <AiOutlineSafety className="w-4 h-4 text-blue-500" />
                    <span>Exigences du mot de passe :</span>
                  </h3>
                  <div className="space-y-2">
                    {passwordRequirements.map((req, index) => {
                      const isValid = checkPasswordRequirement(
                        formData.newPassword,
                        req.regex
                      );
                      return (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 text-xs transition-all duration-300 ${
                            isValid ? "text-green-600" : "text-gray-500"
                          }`}
                          style={{
                            transform: isValid ? "scale(1.02)" : "scale(1)",
                            transition: "all 0.3s ease"
                          }}
                        >
                          <div className={`transition-all duration-300 ${isValid ? "scale-110" : "scale-100"}`}>
                            {isValid ? (
                              <AiOutlineCheckCircle className="w-3 h-3 animate-pulse" />
                            ) : (
                              <AiOutlineCloseCircle className="w-3 h-3" />
                            )}
                          </div>
                          <span className={`transition-all duration-300 ${isValid ? "font-medium" : "font-normal"}`}>
                            {req.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Validation de la correspondance */}
                {formData.confirmPassword && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <AiOutlineCheckCircle className="w-4 h-4 text-blue-500" />
                      <span>Vérification :</span>
                    </h3>
                    <div
                      className={`flex items-center space-x-2 text-xs transition-all duration-300 ${
                        formData.newPassword === formData.confirmPassword
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                      style={{
                        transform: formData.newPassword === formData.confirmPassword ? "scale(1.02)" : "scale(1)",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <div className={`transition-all duration-300 ${formData.newPassword === formData.confirmPassword ? "scale-110" : "scale-100"}`}>
                        {formData.newPassword === formData.confirmPassword ? (
                          <CheckCircle className="w-3 h-3 animate-pulse" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                      </div>
                      <span className={`transition-all duration-300 ${formData.newPassword === formData.confirmPassword ? "font-medium" : "font-normal"}`}>
                        {formData.newPassword === formData.confirmPassword
                          ? "Les mots de passe correspondent"
                          : "Les mots de passe ne correspondent pas"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-2xl p-4 shadow-[0_2px_8px_rgba(239,68,68,0.1)]">
                <div className="flex items-center space-x-2">
                  <AiOutlineCloseCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading || !formData.currentPassword || !passwordRequirements.every((req) => checkPasswordRequirement(formData.newPassword, req.regex)) || formData.newPassword !== formData.confirmPassword}
              gradient={true}
              gradientFrom="blue-600"
              gradientTo="cyan-400"
              size="lg"
              className="font-semibold tracking-tight-soft uppercase text-xs"
            >
              {loading ? (
                "Mise à jour..."
              ) : (
                <>
                  <AiOutlineSafety className="w-4 h-4 mr-2" />
                  Définir le mot de passe
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default FirstConnectionPasswordForm;
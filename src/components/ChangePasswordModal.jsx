import React, { useState } from "react";
import { auth } from "../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
// React Icons
import { AiOutlineLock, AiOutlineClose, AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function ChangePasswordModal({
  isOpen,
  onClose,
  isResetMode = false,
  oobCode = "",
}) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Validation pour activer le bouton
  const isFormValid = () => {
    if (isResetMode) {
      return formData.newPassword && 
             formData.confirmPassword && 
             formData.newPassword === formData.confirmPassword &&
             formData.newPassword.length >= 6;
    } else {
      return formData.oldPassword && 
             formData.newPassword && 
             formData.confirmPassword && 
             formData.newPassword === formData.confirmPassword &&
             formData.newPassword.length >= 6;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      if (isResetMode) {
        if (!oobCode) {
          throw new Error("Code de réinitialisation manquant.");
        }
        const email = await verifyPasswordResetCode(auth, oobCode);
        await confirmPasswordReset(auth, oobCode, formData.newPassword);
        
        // Envoyer l'email de confirmation via la fonction HTTP
        try {
          const response = await fetch('https://sendpasswordchangeconfirmation-rjxvamxmxa-uc.a.run.app', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email: email
            })
          });
          
          if (response.ok) {
            console.log("Email de confirmation envoyé avec succès");
          } else {
            console.error("Erreur lors de l'envoi de l'email de confirmation");
          }
        } catch (emailError) {
          console.error("Erreur lors de l'envoi de l'email de confirmation:", emailError);
        }
        
        alert(
          "Mot de passe réinitialisé avec succès. Veuillez vous connecter."
        );
        onClose();
        navigate("/auth", { replace: true });
      } else {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("Aucun utilisateur connecté.");
        }
        const credential = EmailAuthProvider.credential(
          user.email,
          formData.oldPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, formData.newPassword);
        
        // Envoyer l'email de confirmation via la fonction HTTP
        try {
          const response = await fetch('https://sendpasswordchangeconfirmation-rjxvamxmxa-uc.a.run.app', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email: user.email,
              userId: user.uid 
            })
          });
          
          if (response.ok) {
            console.log("Email de confirmation envoyé avec succès");
          } else {
            console.error("Erreur lors de l'envoi de l'email de confirmation");
          }
        } catch (emailError) {
          console.error("Erreur lors de l'envoi de l'email de confirmation:", emailError);
        }
        
        alert("Mot de passe changé avec succès. Veuillez vous reconnecter.");
        onClose();
        navigate("/auth");
      }
    } catch (err) {
      console.error("Erreur lors du changement de mot de passe:", err);
      let errorMessage =
        "Une erreur est survenue lors du changement de mot de passe.";
      if (err.code) {
        switch (err.code) {
          case "auth/wrong-password":
            errorMessage = "L'ancien mot de passe est incorrect.";
            break;
          case "auth/weak-password":
            errorMessage =
              "Le nouveau mot de passe est trop faible (minimum 6 caractères).";
            break;
          case "auth/requires-recent-login":
            errorMessage =
              "Veuillez vous reconnecter pour effectuer cette action.";
            break;
          case "auth/invalid-action-code":
            errorMessage = "Lien de réinitialisation invalide ou expiré.";
            break;
          case "auth/expired-action-code":
            errorMessage = "Le lien de réinitialisation a expiré.";
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      }
      setError(errorMessage);
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
      className="fixed inset-0 z-101 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl border border-gray-100 animate-scale-in mx-4">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <AiOutlineLock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isResetMode
                    ? "Réinitialiser le mot de passe"
                    : "Changer le mot de passe"}
                </h2>
                <p className="text-blue-200 text-xs">
                  {isResetMode
                    ? "Définir un nouveau mot de passe"
                    : "Mettre à jour votre mot de passe"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <AiOutlineClose className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isResetMode && (
              <div className="space-y-1">
                <label className="flex items-center space-x-1 text-xs font-medium text-gray-700">
                  <AiOutlineLock className="w-3 h-3" />
                  <span>Ancien mot de passe</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-sm"
                    placeholder="Saisir l'ancien mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? (
                      <AiOutlineEyeInvisible className="w-4 h-4" />
                    ) : (
                      <AiOutlineEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="flex items-center space-x-1 text-xs font-medium text-gray-700">
                <AiOutlineLock className="w-3 h-3" />
                <span>Nouveau mot de passe</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-sm"
                  placeholder="Minimum 6 caractères"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible className="w-4 h-4" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="flex items-center space-x-1 text-xs font-medium text-gray-700">
                <AiOutlineLock className="w-3 h-3" />
                <span>Confirmer le mot de passe</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-sm"
                  placeholder="Confirmer le nouveau mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible className="w-4 h-4" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-full p-3">
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 text-sm cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white rounded-full disabled:from-blue-500 disabled:to-blue-400 transition-all duration-200 text-sm cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <AiOutlineLock className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </>
                )}
              </button>
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

export default ChangePasswordModal;

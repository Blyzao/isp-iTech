import React from "react";
// React Icons
import { AiOutlineMail, AiOutlineSend, AiOutlineArrowLeft, AiOutlineKey } from "react-icons/ai";

function ForgotPasswordForm({
  email,
  setEmail,
  isLoading,
  setIsLoading,
  setError,
  setShowForgotPassword,
}) {
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format d'email invalide");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔵 Envoi de demande de réinitialisation pour:", email);
      
      const response = await fetch('https://sendpasswordresetemail-rjxvamxmxa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
      });
      
      const result = await response.json();
      console.log("✅ Résultat:", result);
      
      if (response.ok) {
        alert(
          "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques minutes."
        );
        setShowForgotPassword(false);
      } else {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la demande de réinitialisation:", err);
      let errorMessage = "Erreur lors de l'envoi de la demande.";
      
      if (err.message.includes("USER_NOT_FOUND")) {
        errorMessage = "Utilisateur non trouvé avec cet email.";
      } else if (err.message.includes("INVALID_EMAIL")) {
        errorMessage = "Format d'email invalide.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form bg-white rounded-2xl shadow-soft-xl border border-gray-100 overflow-hidden sidebar-border">
      {/* Header avec dégradé indigo/violet et texte blanc */}
      <div className="bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-600 px-8 py-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-xl font-bold text-white mb-1 tracking-tight">iTech</h1>
          <p className="text-white/90 text-sm font-medium">
            Gestion Intelligente des Équipements
          </p>
        </div>
      </div>

      <div className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-700 mb-2">Mot de passe oublié</h2>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Saisissez votre adresse email et nous vous enverrons un lien pour
            réinitialiser votre mot de passe.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
              <AiOutlineMail className="w-4 h-4 text-slate-600" />
              <span>Adresse email</span>
            </label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sidebar-item block w-full appearance-none rounded-xl border border-gray-200 bg-white bg-clip-padding pl-12 py-3 pr-4 font-medium text-slate-700 transition-all focus:outline-none focus:transition-shadow text-sm leading-5.6 ease-nav-brand focus:border-indigo-400 focus:shadow-soft-xl hover:border-indigo-300"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="sidebar-item w-full bg-gradient-to-tl from-purple-700 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ease-nav-brand shadow-soft-xl hover:shadow-soft-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide uppercase"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <AiOutlineSend className="w-4 h-4" />
                  <span>Envoyer l'email</span>
                </div>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-indigo-600 hover:text-purple-700 text-sm font-semibold normal-case py-2 px-4 rounded-lg transition-all duration-300 ease-nav-brand hover:bg-indigo-50 flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <AiOutlineArrowLeft className="w-4 h-4" />
              <span>Retour à la connexion</span>
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        /* Force la couleur du texte dans les champs d'authentification */
        .auth-form input[type="email"],
        .auth-form input[type="password"],
        .auth-form input[type="text"] {
          color: #111827 !important;
          -webkit-text-fill-color: #111827 !important;
        }
        .auth-form input::placeholder {
          color: #6b7280 !important;
          opacity: 1 !important;
        }
        .auth-form input:-webkit-autofill,
        .auth-form input:-webkit-autofill:hover,
        .auth-form input:-webkit-autofill:focus {
          -webkit-text-fill-color: #111827 !important;
          -webkit-box-shadow: 0 0 0px 1000px #f9fafb inset !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
      `}</style>
    </div>
  );
}

export default ForgotPasswordForm;

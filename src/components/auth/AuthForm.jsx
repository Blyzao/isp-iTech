import React from "react";
// React Icons
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLogin, AiOutlineQuestionCircle } from "react-icons/ai";
import Card, { CardHeader, CardBody } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

function AuthForm({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  handleAuth,
  isLoading,
  setShowForgotPassword,
  showPassword,
  setShowPassword,
}) {
  return (
    <Card className="max-w-md mx-auto overflow-hidden sidebar-border" shadow="soft-xl">
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

      <CardBody className="p-8">

        <form className="space-y-6" onSubmit={handleAuth}>
          {/* Email */}
          <Input
            type="email"
            label="Adresse email"
            icon={AiOutlineMail}
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
              <AiOutlineLock className="w-4 h-4 text-slate-600" />
              <span>Mot de passe</span>
            </label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sidebar-item block w-full appearance-none rounded-xl border border-gray-200 bg-white bg-clip-padding pl-12 py-3 pr-12 font-medium text-slate-700 transition-all focus:outline-none focus:transition-shadow text-sm leading-5.6 ease-nav-brand focus:border-indigo-400 focus:shadow-soft-xl hover:border-indigo-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-all duration-300 ease-nav-brand"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="w-5 h-5" />
                ) : (
                  <AiOutlineEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center relative group">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md transition-all duration-300 ease-nav-brand cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="ml-3 text-sm text-slate-700 cursor-pointer select-none font-semibold flex items-center space-x-2"
            >
              <span>Se souvenir de moi</span>
              <AiOutlineQuestionCircle className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors duration-300" />
            </label>
            <div className="absolute hidden group-hover:block bg-slate-800 text-white text-xs rounded-xl p-3 -top-12 left-0 whitespace-nowrap shadow-soft-2xl z-10 backdrop-blur-sm">
              <div className="relative">
                Ne cochez pas sur un appareil partagé
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="sidebar-item w-full bg-gradient-to-tl from-purple-700 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ease-nav-brand shadow-soft-xl hover:shadow-soft-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide uppercase"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <AiOutlineLogin className="w-4 h-4" />
                  <span>Se connecter</span>
                </div>
              )}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              disabled={isLoading}
              className="w-full text-indigo-600 hover:text-purple-700 text-sm font-semibold normal-case py-2 px-4 rounded-lg transition-all duration-300 ease-nav-brand hover:bg-indigo-50 flex items-center justify-center space-x-2"
            >
              <AiOutlineQuestionCircle className="w-4 h-4" />
              <span>Mot de passe oublié ?</span>
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default AuthForm;

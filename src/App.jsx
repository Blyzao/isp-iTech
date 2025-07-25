import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Auth from "./components/Auth.jsx";
import FirstConnectionPasswordForm from "./components/FirstConnectionPasswordForm.jsx";
import Layout from "./components/Layout.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import Settings from "./components/pages/Settings.jsx";
import UsersTable from "./components/UsersTable.jsx";

const ProtectedRoute = ({ children, user, requiredRoles }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (requiredRoles) {
      const checkRole = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (
          !userDoc.exists() ||
          (Array.isArray(requiredRoles)
            ? !requiredRoles.includes(userDoc.data().profil)
            : userDoc.data().profil !== requiredRoles)
        ) {
          navigate("/");
        }
      };
      checkRole();
    }
  }, [user, requiredRoles, navigate]);
  return user ? children : null;
};

function App() {
  const [user] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState(null);
  const [isFirstConnection, setIsFirstConnection] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showFirstConnection, setShowFirstConnection] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      setLoadingProfile(false);
      setShowFirstConnection(false);
      return;
    }

    const checkUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile(userData);
          const isFirstConnect = userData.firstConnect === true;
          setIsFirstConnection(isFirstConnect);
          setShowFirstConnection(isFirstConnect);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du profil:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    checkUserProfile();
  }, [user, navigate]);

  const handleFirstConnectionComplete = () => {
    setIsFirstConnection(false);
    setShowFirstConnection(false);
    navigate("/");
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user && showFirstConnection) {
    return (
      <FirstConnectionPasswordForm
        user={user}
        onComplete={handleFirstConnectionComplete}
      />
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            {userProfile?.profil === 'admin' ? (
              <Layout 
                userProfile={userProfile} 
                pageTitle="Dashboard" 
                pageCategory="Pages"
              >
                <Dashboard userProfile={userProfile} />
              </Layout>
            ) : (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-4xl mx-auto px-6">
                  <div className="mb-8">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6">
                      iTech
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 mb-4">
                      Plateforme dédiée à la gestion intelligente des équipements
                    </p>
                    <p className="text-lg text-gray-500 mb-8">
                      Centralise le suivi, l'inventaire et la maintenance des matériels de sûreté
                      pour <span className="font-semibold text-blue-600">Ivoire Sûreté Portuaire</span>
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-3xl mb-4">📊</div>
                      <h3 className="text-xl font-semibold mb-2">Suivi Intelligent</h3>
                      <p className="text-gray-600">
                        Surveillance en temps réel de tous vos équipements de sécurité
                      </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-3xl mb-4">🔧</div>
                      <h3 className="text-xl font-semibold mb-2">Maintenance Proactive</h3>
                      <p className="text-gray-600">
                        Planification et gestion optimisée de la maintenance préventive
                      </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-3xl mb-4">📋</div>
                      <h3 className="text-xl font-semibold mb-2">Inventaire Centralisé</h3>
                      <p className="text-gray-600">
                        Base de données complète de tous les matériels de sûreté
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-8 rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Bienvenue, {userProfile?.nom || "Utilisateur"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Votre plateforme de gestion des équipements est en cours de développement.
                      Les fonctionnalités seront bientôt disponibles.
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => auth.signOut()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'superviseur']}>
            <Layout 
              userProfile={userProfile} 
              pageTitle="Paramètres" 
              pageCategory="Configuration"
            >
              <Settings userProfile={userProfile} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/users"
        element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'superviseur']}>
            <Layout 
              userProfile={userProfile} 
              pageTitle="Utilisateurs" 
              pageCategory="Configuration"
            >
              <UsersTable userProfile={userProfile} />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
// React Icons
import {
  AiOutlineTeam,
  AiOutlineUserAdd,
  AiOutlineEdit,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineSafety,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlinePhone,
  AiOutlineBank,
} from "react-icons/ai";
import UserFormModal from "./UserFormModal";

function UsersTable({ userProfile }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProfile, setFilterProfile] = useState("all");
  const [filterEmailProfil, setFilterEmailProfil] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nom: doc.data().nom || "N/A",
        email: doc.data().email || "N/A",
        phone: doc.data().phone || "N/A",
        profil: doc.data().profil || "user",
        departement: doc.data().departement || "N/A",
        isActive: doc.data().isActive !== false,
        isVerified: doc.data().isVerified || false,
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    setEditUserId(userId);
    setModalOpen(true);
  };

  const handleNewUser = () => {
    setEditUserId(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditUserId(null);
    fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);
    const matchesProfile =
      filterProfile === "all" || user.profil === filterProfile;
    return (
      matchesSearch && matchesStatus && matchesProfile
    );
  });

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-slate-600 text-sm font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="sidebar-icon shadow-soft-2xl flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tl from-orange-500 to-orange-600">
                <AiOutlineTeam className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-poppins">
                  Utilisateurs
                </h1>
                <p className="text-slate-600 text-sm font-medium">Gestion des comptes utilisateurs</p>
              </div>
            </div>
            <button
              onClick={handleNewUser}
              className="sidebar-item flex items-center space-x-2 bg-gradient-to-tl from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-soft-xl hover:shadow-soft-2xl hover:scale-105 text-sm font-semibold tracking-wide"
            >
              <AiOutlineUserAdd className="w-5 h-5" />
              <span>Nouvel utilisateur</span>
            </button>
          </div>
        </div>

        <div className="sidebar-border bg-white rounded-2xl shadow-soft-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou fonction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sidebar-item w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 text-sm font-medium text-slate-700 bg-white"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <AiOutlineFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="sidebar-item pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm font-medium text-slate-700 bg-white"
                >
                  <option value="all">Tous statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>
              <select
                value={filterProfile}
                onChange={(e) => setFilterProfile(e.target.value)}
                className="sidebar-item px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm font-medium text-slate-700 bg-white"
              >
                <option value="all">Tous profils</option>
                <option value="admin">Administrateur</option>
                <option value="superviseur">Superviseur</option>
                <option value="user">Utilisateur</option>
              </select>
              <select
                value={filterEmailProfil}
                onChange={(e) => setFilterEmailProfil(e.target.value)}
                className="sidebar-item px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm font-medium text-slate-700 bg-white"
              >
                <option value="all">Tous email profils</option>
                <option value="niveau1">Niveau 1</option>
                <option value="niveau2">Niveau 2</option>
                <option value="niveau3">Niveau 3</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-soft-xl"></div>
              <span className="text-sm text-slate-600 font-medium">
                {users.filter((u) => u.active).length} actifs
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full shadow-soft-xl"></div>
              <span className="text-sm text-slate-600 font-medium">
                {users.filter((u) => !u.active).length} inactifs
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AiOutlineSafety className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-slate-600 font-medium">
                {users.filter((u) => u.profil === "admin").length} admins
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AiOutlineSafety className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-slate-600 font-medium">
                {users.filter((u) => u.profil === "superviseur").length} superviseurs
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AiOutlineMail className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-slate-600 font-medium">
                {users.filter((u) => u.emailProfil === "niveau1").length} niveau 1
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar-border bg-white rounded-2xl shadow-soft-xl overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <AiOutlineTeam className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                {searchTerm ||
                filterStatus !== "all" ||
                filterProfile !== "all" ||
                filterEmailProfil !== "all"
                  ? "Aucun utilisateur trouvé"
                  : "Aucun utilisateur"}
              </h3>
              <p className="text-gray-600 text-sm">
                {searchTerm ||
                filterStatus !== "all" ||
                filterProfile !== "all" ||
                filterEmailProfil !== "all"
                  ? "Modifiez vos critères de recherche"
                  : "Créez votre premier utilisateur"}
              </p>
              {!searchTerm &&
                filterStatus === "all" &&
                filterProfile === "all" &&
                filterEmailProfil === "all" && (
                  <button
                    onClick={handleNewUser}
                    className="mt-4 flex items-center space-x-1 mx-auto bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 rounded-full transition-all duration-200 text-sm"
                  >
                    <AiOutlineUserAdd className="w-4 h-4" />
                    <span>Créer un utilisateur</span>
                  </button>
                )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center space-x-1">
                        <AiOutlineUser className="w-4 h-4" />
                        <span>Utilisateur</span>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center space-x-1">
                        <AiOutlineMail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Profil
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Email Profil
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center space-x-1">
                        <AiOutlineBriefcase className="w-4 h-4" />
                        <span>Fonction</span>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                            ${
                              user.profil === "admin"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700"
                                : user.profil === "superviseur"
                                ? "bg-gradient-to-r from-purple-500 to-purple-600"
                                : "bg-gradient-to-r from-gray-500 to-gray-600"
                            }`}
                          >
                            {user.nom.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.nom}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                            ${
                              user.profil === "admin"
                                ? "bg-blue-100 text-blue-800"
                                : user.profil === "superviseur"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {user.profil === "admin" ? (
                            <AiOutlineSafety className="w-3 h-3" />
                          ) : user.profil === "superviseur" ? (
                            <AiOutlineSafety className="w-3 h-3" />
                          ) : (
                            <AiOutlineUser className="w-3 h-3" />
                          )}
                          <span>
                            {user.profil === "admin"
                              ? "Administrateur"
                              : user.profil === "superviseur"
                              ? "Superviseur"
                              : "Utilisateur"}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                            ${
                              user.emailProfil === "niveau1"
                                ? "bg-blue-100 text-blue-800"
                                : user.emailProfil === "niveau2"
                                ? "bg-blue-200 text-blue-900"
                                : "bg-blue-300 text-blue-900"
                            }`}
                        >
                          <AiOutlineMail className="w-3 h-3" />
                          <span>
                            {user.emailProfil === "niveau1"
                              ? "Niveau 1"
                              : user.emailProfil === "niveau2"
                              ? "Niveau 2"
                              : "Niveau 3"}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.fonction}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                            ${
                              user.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {user.active ? (
                            <AiOutlineCheckCircle className="w-3 h-3" />
                          ) : (
                            <AiOutlineCloseCircle className="w-3 h-3" />
                          )}
                          <span>{user.active ? "Actif" : "Inactif"}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-all duration-200 text-sm"
                        >
                          <AiOutlineEdit className="w-4 h-4" />
                          <span>Modifier</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filteredUsers.length > 0 && (
          <div className="mt-4 text-center text-gray-600 text-sm">
            Affichage de {filteredUsers.length} utilisateur
            {filteredUsers.length > 1 ? "s" : ""}
            {users.length !== filteredUsers.length &&
              ` sur ${users.length} au total`}
          </div>
        )}

        <UserFormModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          userId={editUserId}
          isEditMode={!!editUserId}
        />
      </div>
    </div>
  );
}

export default UsersTable;

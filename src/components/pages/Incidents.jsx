import React, { useState } from 'react';
import { AiOutlineAlert, AiOutlineEye, AiOutlinePlus, AiOutlineFilter } from 'react-icons/ai';

const Incidents = ({ userProfile }) => {
  const [filter, setFilter] = useState('all');
  
  // Simulated incidents data
  const incidents = [
    {
      id: 1,
      title: 'Dysfonctionnement caméra secteur Nord',
      description: 'La caméra de surveillance du secteur Nord ne fonctionne plus depuis ce matin',
      status: 'open',
      priority: 'high',
      createdBy: 'admin',
      createdAt: '2024-01-20T10:30:00',
      location: 'Secteur Nord - Entrée principale'
    },
    {
      id: 2,
      title: 'Équipement défaillant Zone 3',
      description: 'Problème électrique sur l\'équipement de sécurité zone 3',
      status: 'in_progress',
      priority: 'medium',
      createdBy: 'user',
      createdAt: '2024-01-19T14:15:00',
      location: 'Zone 3 - Stockage'
    },
    {
      id: 3,
      title: 'Maintenance préventive requise',
      description: 'Maintenance préventive à effectuer sur les équipements du bâtiment A',
      status: 'resolved',
      priority: 'low',
      createdBy: 'superviseur',
      createdAt: '2024-01-18T09:00:00',
      location: 'Bâtiment A'
    }
  ];

  const canViewAllIncidents = userProfile?.profil === 'admin' || userProfile?.profil === 'superviseur' || userProfile?.profil === 'technicien';
  
  // Filter incidents based on user permissions
  const filteredIncidents = incidents.filter(incident => {
    if (!canViewAllIncidents && incident.createdBy !== userProfile?.profil) {
      return false;
    }
    if (filter === 'all') return true;
    return incident.status === filter;
  });

  const statusConfig = {
    open: { label: 'Ouvert', color: 'bg-red-100 text-red-800' },
    in_progress: { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
    resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800' }
  };

  const priorityConfig = {
    high: { label: 'Haute', color: 'text-red-600' },
    medium: { label: 'Moyenne', color: 'text-yellow-600' },
    low: { label: 'Basse', color: 'text-green-600' }
  };

  return (
    <div className="flex flex-wrap -mx-3">
      {/* Page Header */}
      <div className="w-full px-3 mb-6">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-6 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="text-slate-700">Gestion des Incidents</h6>
                <p className="text-sm leading-normal text-slate-500">
                  {canViewAllIncidents ? 'Tous les incidents signalés' : 'Vos incidents signalés'}
                </p>
              </div>
              <button className="inline-block px-6 py-3 text-xs font-bold text-center text-white uppercase align-middle transition-all bg-gradient-to-tl from-blue-600 to-cyan-400 rounded-lg cursor-pointer hover:scale-102 leading-pro ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:shadow-soft-2xl">
                <AiOutlinePlus className="w-4 h-4 mr-2 inline" />
                Nouveau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full px-3 mb-6">
        <div className="flex items-center space-x-4">
          <AiOutlineFilter className="w-5 h-5 text-slate-500" />
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'open', label: 'Ouverts' },
              { key: 'in_progress', label: 'En cours' },
              { key: 'resolved', label: 'Résolus' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  filter === filterOption.key
                    ? 'bg-gradient-to-tl from-blue-600 to-cyan-400 text-white shadow-soft-md'
                    : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="w-full px-3">
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-6 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
            <h6 className="mb-0 text-slate-700">Liste des Incidents</h6>
          </div>
          <div className="flex-auto px-0 pt-0 pb-2">
            <div className="p-0 overflow-x-auto">
              <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
                <thead className="align-bottom">
                  <tr>
                    <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      Incident
                    </th>
                    <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      Statut
                    </th>
                    <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      Priorité
                    </th>
                    <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      Lieu
                    </th>
                    <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      Date
                    </th>
                    <th className="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-gray-200 border-solid shadow-none tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td className="p-6 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <div className="flex items-center">
                          <AiOutlineAlert className="w-5 h-5 mr-3 text-slate-400" />
                          <div>
                            <h6 className="mb-0 text-sm leading-normal text-slate-700">
                              {incident.title}
                            </h6>
                            <p className="mb-0 text-xs leading-tight text-slate-400">
                              {incident.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[incident.status].color}`}>
                          {statusConfig[incident.status].label}
                        </span>
                      </td>
                      <td className="p-6 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <span className={`text-xs font-semibold ${priorityConfig[incident.priority].color}`}>
                          {priorityConfig[incident.priority].label}
                        </span>
                      </td>
                      <td className="p-6 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <span className="text-xs font-semibold leading-tight text-slate-400">
                          {incident.location}
                        </span>
                      </td>
                      <td className="p-6 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <span className="text-xs font-semibold leading-tight text-slate-400">
                          {new Date(incident.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td className="p-6 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <button className="inline-block px-4 py-2 text-xs font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in bg-150 hover:scale-102 active:shadow-soft-xs text-slate-700 hover:text-slate-900">
                          <AiOutlineEye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incidents;
import React from 'react';
import { 
  AiOutlineDollarCircle, 
  AiOutlineUser, 
  AiOutlineFileText, 
  AiOutlineShoppingCart,
  AiOutlineRocket,
  AiOutlineCheck,
  AiOutlineNotification,
  AiOutlineTeam,
  AiOutlineBell,
  AiOutlineBarChart,
  AiOutlineAlert,
  AiOutlineCamera,
  AiOutlineTool
} from 'react-icons/ai';

const Dashboard = ({ userProfile }) => {
  // Données simulées - à remplacer par de vraies données
  const stats = [
    {
      title: "Budget Équipements",
      value: "125,400",
      unit: "FCFA",
      change: "+55%",
      changeType: "positive",
      icon: AiOutlineDollarCircle,
      gradient: "from-purple-700 to-pink-500"
    },
    {
      title: "Utilisateurs Actifs",
      value: "2,300",
      unit: "",
      change: "+3%",
      changeType: "positive", 
      icon: AiOutlineUser,
      gradient: "from-blue-600 to-cyan-400"
    },
    {
      title: "Incidents Ouverts",
      value: "34",
      unit: "",
      change: "-2%",
      changeType: "negative",
      icon: AiOutlineFileText,
      gradient: "from-green-600 to-lime-400"
    },
    {
      title: "Équipements",
      value: "1,250",
      unit: "",
      change: "+5%",
      changeType: "positive",
      icon: AiOutlineShoppingCart,
      gradient: "from-orange-600 to-yellow-400"
    }
  ];

  const projects = [
    {
      name: "Système de Sûreté Port",
      members: ["RB", "AB", "CD"],
      budget: "14,000 FCFA",
      completion: 60
    },
    {
      name: "Caméras de Surveillance",
      members: ["EF", "GH"],
      budget: "3,000 FCFA", 
      completion: 100
    },
    {
      name: "Équipements d'Urgence",
      members: ["IJ", "KL", "MN", "OP"],
      budget: "Not set",
      completion: 25
    },
    {
      name: "Maintenance Préventive",
      members: ["QR", "ST"],
      budget: "20,500 FCFA",
      completion: 80
    }
  ];

  const timeline = [
    {
      icon: AiOutlineBell,
      title: "$2400, Changement de design",
      time: "22 DEC 7:20 PM",
      gradient: "from-green-600 to-lime-400"
    },
    {
      icon: AiOutlineRocket,
      title: "Nouveau équipement ajouté",
      time: "21 DEC 11 PM",
      gradient: "from-red-600 to-orange-500"
    },
    {
      icon: AiOutlineShoppingCart,
      title: "Commande de matériel #2395033",
      time: "21 DEC 9:34 PM", 
      gradient: "from-blue-600 to-cyan-400"
    },
    {
      icon: AiOutlineTeam,
      title: "Nouveau membre d'équipe",
      time: "20 DEC 2:20 AM",
      gradient: "from-purple-700 to-pink-500"
    },
    {
      icon: AiOutlineCheck,
      title: "Maintenance terminée",
      time: "18 DEC 4:54 AM",
      gradient: "from-slate-600 to-slate-400"
    }
  ];

  return (
    <div className="w-full">
      {/* Cartes de statistiques */}
      <div className="flex flex-wrap -mx-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
              <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
                <div className="flex-auto p-4">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div>
                        <p className="mb-0 font-sans text-sm font-semibold leading-normal text-slate-700">
                          {stat.title}
                        </p>
                        <h5 className="mb-0 font-bold text-slate-700">
                          {stat.value} {stat.unit}
                          <span className={`text-sm font-weight-bolder ml-2 ${
                            stat.changeType === 'positive' ? 'text-lime-500' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="w-4/12 max-w-full px-3 ml-auto text-right flex-none">
                      <div className={`w-12 h-12 text-center rounded-lg bg-gradient-to-tl ${stat.gradient} shadow-soft-2xl`}>
                        <Icon className="w-6 h-6 text-white mx-auto mt-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rangée de cartes promotionnelles */}
      <div className="flex flex-wrap -mx-3 mt-6">
        <div className="w-full max-w-full px-3 mt-0 mb-6 md:mb-0 md:w-7/12 md:flex-none">
          <div className="relative flex flex-col min-w-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="p-4 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
              <h6 className="mb-0 text-slate-700 font-bold">iTech Platform</h6>
            </div>
            <div className="flex-auto p-4">
              <p className="leading-normal text-sm text-slate-500">
                Développé par des professionnels pour la gestion intelligente des équipements portuaires.
              </p>
              <hr className="h-px my-6 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
              <div className="flex items-center">
                <AiOutlineRocket className="w-6 h-6 text-blue-500 mr-2" />
                <span className="text-slate-700 text-sm font-semibold">
                  Gestion avancée pour Ivoire Sûreté Portuaire
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-full px-3 md:w-5/12 md:flex-none">
          <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="relative flex flex-col flex-auto min-w-0 p-4 overflow-hidden break-words bg-transparent border-0 border-solid shadow-none rounded-2xl bg-clip-border"
                 style={{
                   backgroundImage: "linear-gradient(310deg, #667eea 0%, #764ba2 100%)",
                 }}>
              <span className="font-semibold text-white text-sm">Bienvenue</span>
              <h5 className="mb-4 font-bold text-white">
                {userProfile?.nom || 'Administrateur'}
              </h5>
              <p className="mb-0 text-white text-sm">
                Votre tableau de bord de gestion des équipements de sûreté.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des projets et timeline */}
      <div className="flex flex-wrap -mx-3 mt-6">
        <div className="w-full max-w-full px-3 mt-0 mb-6 md:mb-0 md:w-1/2 md:flex-none lg:w-2/3 lg:flex-none">
          <div className="relative flex flex-col min-w-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="p-4 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
              <h6 className="mb-0 text-slate-700 font-bold">Projets d'équipements</h6>
            </div>
            <div className="flex-auto px-0 pt-0 pb-2">
              <div className="p-0 overflow-x-auto">
                <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
                  <thead className="align-bottom">
                    <tr>
                      <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                        Projet
                      </th>
                      <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                        Membres
                      </th>
                      <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                        Budget
                      </th>
                      <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                        Avancement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr key={index}>
                        <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                          <div className="flex px-2 py-1">
                            <div className="flex flex-col justify-center">
                              <h6 className="mb-0 text-sm leading-normal text-slate-700">{project.name}</h6>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                          <div className="flex">
                            {project.members.map((member, idx) => (
                              <div key={idx} className={`w-6 h-6 rounded-full bg-gradient-to-tl from-slate-600 to-slate-300 text-white text-xs flex items-center justify-center ${idx > 0 ? '-ml-2' : ''}`}>
                                {member}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                          <span className="text-xs font-semibold leading-tight text-slate-400">{project.budget}</span>
                        </td>
                        <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                          <div className="flex items-center justify-center">
                            <span className="mr-2 text-xs font-semibold leading-tight text-slate-400">{project.completion}%</span>
                            <div className="text-xs">
                              <div className="overflow-hidden h-0.75 text-xs flex rounded bg-gray-200 w-16">
                                <div 
                                  className={`duration-600 ease-soft shadow-soft-2xl rounded bg-gradient-to-tl ${
                                    project.completion === 100 ? 'from-green-600 to-lime-400' :
                                    project.completion >= 75 ? 'from-blue-600 to-cyan-400' :
                                    project.completion >= 50 ? 'from-yellow-600 to-orange-400' :
                                    'from-red-600 to-rose-400'
                                  }`}
                                  style={{ width: `${project.completion}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="w-full max-w-full px-3 md:w-1/2 md:flex-none lg:w-1/3 lg:flex-none">
          <div className="relative flex flex-col min-w-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="p-4 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
              <h6 className="mb-0 text-slate-700 font-bold">
                Aperçu des activités
                <span className="text-lime-500 text-sm font-weight-bolder ml-2">+30%</span>
              </h6>
            </div>
            <div className="flex-auto p-4">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex pb-4">
                    <div className="mr-4">
                      <div className={`w-6 h-6 text-center rounded-lg bg-gradient-to-tl ${item.gradient} shadow-soft-2xl`}>
                        <Icon className="w-3 h-3 text-white mx-auto mt-1.5" />
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1 text-sm font-semibold leading-normal text-slate-700">
                        {item.title}
                      </h6>
                      <p className="mb-0 text-xs leading-tight text-slate-400">
                        {item.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
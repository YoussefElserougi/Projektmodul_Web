import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Users, 
  CheckCircle, 
  Target, 
  Megaphone,
  Building,
  BarChart3,
  FileText,
  ArrowRight,
  ChevronRight,
  Globe,
  Instagram,
  Mail,
  Newspaper
} from 'lucide-react';
import InfoModal from './InfoModal';
import crisisFlowData from '../../data/crisisFlowData';

const CrisisFlowChart = ({ onNavigateToContent }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePhase, setActivePhase] = useState(null);

  const handleNodeClick = (nodeKey) => {
    let nodeData;
    if (nodeKey.startsWith('extern.')) {
      const subKey = nodeKey.replace('extern.', '');
      nodeData = crisisFlowData.extern[subKey];
    } else if (nodeKey.startsWith('intern.')) {
      const subKey = nodeKey.replace('intern.', '');
      nodeData = crisisFlowData.intern[subKey];
    } else {
      nodeData = crisisFlowData[nodeKey];
    }
    
    if (nodeData) {
      setSelectedNode(nodeData);
      setIsModalOpen(true);
    }
  };

  const phases = [
    {
      id: 'alert',
      number: '01',
      title: 'Krise erkennen',
      subtitle: 'Alarmierung & Ersteinschätzung',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      id: 'prepare',
      number: '02', 
      title: 'Vorbereitung',
      subtitle: 'Fakten sammeln & Team aufstellen',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      id: 'strategy',
      number: '03',
      title: 'Strategie',
      subtitle: 'Kommunikationsstrategie festlegen',
      icon: Target,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      id: 'communicate',
      number: '04',
      title: 'Kommunikation',
      subtitle: 'Extern & Intern informieren',
      icon: Megaphone,
      color: 'from-[#c26d70] to-[#a85a5d]',
      bgColor: 'bg-red-50',
      borderColor: 'border-[#c26d70]/30',
    },
    {
      id: 'monitor',
      number: '05',
      title: 'Monitoring',
      subtitle: 'Beobachten & Anpassen',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'close',
      number: '06',
      title: 'Abschluss',
      subtitle: 'Dokumentation & Learnings',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    }
  ];

  const quickActions = [
    {
      title: 'Social Media Posts',
      description: 'KI-generierte Krisenkommunikation für Instagram, LinkedIn & Facebook',
      icon: Instagram,
      action: () => onNavigateToContent('socialMedia'),
      color: 'bg-gradient-to-br from-pink-500 to-purple-600'
    },
    {
      title: 'Pressemitteilung',
      description: 'Professionelle Pressemitteilung für Medienanfragen erstellen',
      icon: Newspaper,
      action: () => onNavigateToContent('presse'),
      color: 'bg-gradient-to-br from-[#c26d70] to-[#a85a5d]'
    },
    {
      title: 'Website Statement',
      description: 'Pop-up oder Nachricht für die Unternehmenswebsite',
      icon: Globe,
      action: () => onNavigateToContent('internet'),
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#7b2d3a] to-[#c26d70] rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Krisenkommunikation</h1>
              <p className="text-white/80">Strukturierter Ablauf für effektive Krisenbewältigung</p>
            </div>
          </div>
          
          <p className="text-white/70 max-w-2xl mb-6">
            Folgen Sie dem bewährten Prozess zur Krisenkommunikation. Klicken Sie auf eine Phase 
            für detaillierte Informationen, Checklisten und Vorlagen.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleNodeClick('krise')}
              className="px-4 py-2 bg-white text-[#7b2d3a] rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              Krisenfall starten
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleNodeClick('strategie')}
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              Strategieübersicht
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#c26d70]" />
          Schnellaktionen - Content erstellen
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="group p-5 bg-white rounded-xl border border-gray-200 hover:border-[#c26d70] hover:shadow-lg transition-all text-left"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
                <div className="mt-3 text-[#c26d70] text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Jetzt erstellen <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Process Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#c26d70]" />
          Ablauf Krisenkommunikation
        </h2>
        
        <div className="relative">
          <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />
          
          <div className="space-y-4">
            {phases.map((phase) => {
              const PhaseIcon = phase.icon;
              return (
                <div 
                  key={phase.id}
                  className={`relative ${activePhase === phase.id ? 'z-10' : ''}`}
                >
                  <button
                    onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left
                      ${activePhase === phase.id 
                        ? phase.bgColor + ' ' + phase.borderColor + ' shadow-lg'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                      }`}
                  >
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {phase.number}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <PhaseIcon className={`w-5 h-5 ${activePhase === phase.id ? 'text-[#7b2d3a]' : 'text-gray-400'}`} />
                        <h3 className="font-semibold text-gray-800">{phase.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{phase.subtitle}</p>
                      
                      {activePhase === phase.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <PhaseContent 
                            phase={phase} 
                            onNodeClick={handleNodeClick}
                            onNavigateToContent={onNavigateToContent}
                          />
                        </div>
                      )}
                    </div>
                    
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${activePhase === phase.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeData={selectedNode}
        onNavigateToContent={onNavigateToContent}
      />
    </div>
  );
};

const PhaseContent = ({ phase, onNodeClick, onNavigateToContent }) => {
  switch (phase.id) {
    case 'alert':
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <ActionCard icon={AlertTriangle} title="Krise erkannt" description="Erste Einschätzung" onClick={() => onNodeClick('krise')} />
          <ActionCard icon={Phone} title="Krisenstab informieren" description="Chatgruppe / Telefon" onClick={() => onNodeClick('infoKrisenstab')} />
        </div>
      );
    case 'prepare':
      return (
        <div className="grid sm:grid-cols-3 gap-3">
          <ActionCard icon={FileText} title="Infos sammeln" description="Fakten zusammenstellen" onClick={() => onNodeClick('zusammenstellen')} />
          <ActionCard icon={CheckCircle} title="Validieren" description="Informationen prüfen" onClick={() => onNodeClick('validieren')} />
          <ActionCard icon={Users} title="Rollen verteilen" description="Aufgaben zuweisen" onClick={() => onNodeClick('rollen')} />
        </div>
      );
    case 'strategy':
      return (
        <ActionCard icon={Target} title="Strategie festlegen" description="Kommunikationsstrategie und Kernbotschaften definieren" onClick={() => onNodeClick('strategie')} fullWidth />
      );
    case 'communicate':
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Externe Kommunikation
            </h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <ActionCard icon={Newspaper} title="Presse" description="PM / Statement" onClick={() => onNodeClick('extern.presse')} action={() => onNavigateToContent('presse')} actionLabel="Content erstellen" />
              <ActionCard icon={Globe} title="Internet" description="Webseite / Pop-up" onClick={() => onNodeClick('extern.internet')} action={() => onNavigateToContent('internet')} actionLabel="Content erstellen" />
              <ActionCard icon={Instagram} title="Social Media" description="Insta, LI, FB" onClick={() => onNodeClick('extern.socialMedia')} action={() => onNavigateToContent('socialMedia')} actionLabel="Content erstellen" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Building className="w-4 h-4" /> Interne Kommunikation
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <ActionCard icon={Users} title="Führungskräfte" description="Mail / Chat" onClick={() => onNodeClick('intern.organisationsleitung')} />
              <ActionCard icon={Mail} title="Belegschaft" description="Mail / shl-mag" onClick={() => onNodeClick('intern.belegschaft')} />
            </div>
          </div>
        </div>
      );
    case 'monitor':
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <ActionCard icon={BarChart3} title="Monitoring & Updates" description="Reaktionen beobachten" onClick={() => onNodeClick('monitoringExtern')} />
          <ActionCard icon={CheckCircle} title="Evaluation" description="Maßnahmen bewerten" onClick={() => onNodeClick('evaluation')} />
        </div>
      );
    case 'close':
      return (
        <ActionCard icon={FileText} title="Abschlussbericht & Learnings" description="Dokumentation erstellen" onClick={() => onNodeClick('abschlussbericht')} fullWidth />
      );
    default:
      return null;
  }
};

const ActionCard = ({ icon: Icon, title, description, onClick, action, actionLabel, fullWidth = false }) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-3 hover:border-[#c26d70] hover:shadow-md transition-all cursor-pointer group ${fullWidth ? 'col-span-full' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#c26d70]/10 rounded-lg group-hover:bg-[#c26d70]/20 transition-colors">
          <Icon className="w-4 h-4 text-[#c26d70]" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-gray-800 text-sm">{title}</h5>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {action && (
          <button
            onClick={(e) => { e.stopPropagation(); action(); }}
            className="text-xs text-[#c26d70] hover:text-[#a85a5d] font-medium whitespace-nowrap"
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
};

export default CrisisFlowChart;

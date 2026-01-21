import React from 'react';
import { X, CheckSquare, Square, Users, MessageSquare, FileText, Mail } from 'lucide-react';

const InfoModal = ({ isOpen, onClose, nodeData, onNavigateToContent }) => {
  if (!isOpen || !nodeData) return null;

  const renderChecklist = (checklist) => (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Checkliste:</h4>
      {checklist.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          {item.checked ? (
            <CheckSquare className="w-4 h-4 text-green-500" />
          ) : (
            <Square className="w-4 h-4 text-gray-400" />
          )}
          <span>{item.item}</span>
        </div>
      ))}
    </div>
  );

  const renderRoles = (roles) => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Rollenverteilung:
      </h4>
      <div className="grid gap-2">
        {roles.map((role, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-[#7b2d3a]">{role.role}</div>
            <div className="text-sm text-gray-600">{role.person}</div>
            <div className="text-xs text-gray-500 mt-1">{role.tasks}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContacts = (contacts) => (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Kontakte:
      </h4>
      {contacts.map((contact, index) => (
        <div key={index} className="bg-gray-50 p-2 rounded text-sm">
          <span className="font-medium">{contact.name}</span>
          <span className="text-gray-500"> - {contact.method}: </span>
          <span className="text-[#7b2d3a]">{contact.info}</span>
        </div>
      ))}
    </div>
  );

  const renderStrategies = (strategies) => (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Strategieoptionen:</h4>
      <div className="grid gap-2">
        {strategies.map((strategy, index) => (
          <div key={index} className="border border-[#c26d70] rounded-lg p-3 hover:bg-red-50 cursor-pointer transition-colors">
            <div className="font-medium text-[#7b2d3a]">{strategy.name}</div>
            <div className="text-sm text-gray-600">{strategy.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplate = (template, title) => (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700 flex items-center gap-2">
        <Mail className="w-4 h-4" />
        {title || 'Vorlage:'}
      </h4>
      <pre className="bg-gray-50 p-3 rounded-lg text-xs whitespace-pre-wrap font-mono border">
        {template}
      </pre>
      <button className="text-sm text-[#7b2d3a] hover:underline">
        📋 In Zwischenablage kopieren
      </button>
    </div>
  );

  const renderActions = (actions) => (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Aktionen:</h4>
      <ul className="space-y-1">
        {actions.map((action, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="text-[#c26d70] mt-0.5">•</span>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderOutputs = (outputs) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {outputs.map((output, index) => (
        <span key={index} className="bg-[#c26d70] text-white px-3 py-1 rounded-full text-sm">
          {output}
        </span>
      ))}
    </div>
  );

  // Check if this is an extern node that should link to content generation
  const isExternContentNode = ['presse', 'internet', 'socialMedia'].includes(nodeData.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#7b2d3a] text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{nodeData.title}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          {/* Description */}
          <p className="text-gray-600">{nodeData.description}</p>

          {/* Outputs if available */}
          {nodeData.outputs && renderOutputs(nodeData.outputs)}

          {/* Communication Method Badge */}
          {nodeData.communicationMethod && (
            <div className="inline-block bg-[#c26d70]/10 text-[#c26d70] px-3 py-1 rounded-full text-sm">
              📱 {nodeData.communicationMethod}
            </div>
          )}

          {/* Actions */}
          {nodeData.actions && renderActions(nodeData.actions)}

          {/* Checklist */}
          {nodeData.checklist && renderChecklist(nodeData.checklist)}

          {/* Roles */}
          {nodeData.roles && renderRoles(nodeData.roles)}

          {/* Contacts */}
          {nodeData.contacts && nodeData.contacts.length > 0 && renderContacts(nodeData.contacts)}

          {/* Strategies */}
          {nodeData.strategies && renderStrategies(nodeData.strategies)}

          {/* Key Messages */}
          {nodeData.keyMessages && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Kernbotschaften:</h4>
              {nodeData.keyMessages.map((msg, index) => (
                <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-2 text-sm">
                  {msg}
                </div>
              ))}
            </div>
          )}

          {/* Template */}
          {nodeData.template && renderTemplate(nodeData.template)}

          {/* Metrics */}
          {nodeData.metrics && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Metriken:</h4>
              <div className="grid grid-cols-3 gap-2">
                {nodeData.metrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#7b2d3a]">{metric.value}</div>
                    <div className="text-xs text-gray-500">{metric.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions */}
          {nodeData.questions && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Leitfragen:</h4>
              {nodeData.questions.map((q, index) => (
                <div key={index} className="flex items-start gap-2 text-sm bg-blue-50 p-2 rounded">
                  <span className="text-blue-500">❓</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          )}

          {/* Report Sections */}
          {nodeData.reportSections && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Berichtsstruktur:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {nodeData.reportSections.map((section, index) => (
                  <li key={index} className="text-gray-600">{section}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          {isExternContentNode && onNavigateToContent && (
            <button
              onClick={() => {
                onNavigateToContent(nodeData.id);
                onClose();
              }}
              className="px-4 py-2 bg-[#c26d70] text-white rounded-lg hover:bg-[#a85a5d] transition-colors"
            >
              Content generieren →
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;

import React, { useState } from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import FlowNode from './FlowNode';
import InfoModal from './InfoModal';
import crisisFlowData from '../../data/crisisFlowData';
import Card from '../common/Card';

const CrisisFlowChart = ({ onNavigateToContent }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNodeClick = (nodeKey) => {
    // Handle nested extern/intern nodes
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

  const Arrow = () => (
    <div className="flex justify-center py-2">
      <ArrowDown className="w-5 h-5 text-[#7b2d3a]" />
    </div>
  );

  const ConnectorLine = ({ className = '' }) => (
    <div className={`border-l-2 border-[#7b2d3a] h-6 ${className}`} />
  );

  return (
    <Card className="overflow-x-auto">
      <div className="min-w-[800px] p-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-[#7b2d3a] mb-6">
          Ablauf Krisenkommunikation
        </h2>

        {/* Flow Chart */}
        <div className="flex flex-col items-center">
          
          {/* 1. Krise (Start) */}
          <FlowNode
            title="Krise"
            variant="oval"
            size="medium"
            onClick={() => handleNodeClick('krise')}
          />
          <Arrow />

          {/* 2. Info an Krisenstab */}
          <div className="flex items-center gap-4">
            <FlowNode
              title="Info an Krisenstab durch Organisationsleitung"
              variant="rectangle"
              size="wide"
              onClick={() => handleNodeClick('infoKrisenstab')}
            />
            <FlowNode
              title="Chatgruppe / Telefon"
              variant="output"
              size="small"
              onClick={() => handleNodeClick('infoKrisenstab')}
            />
          </div>
          <Arrow />

          {/* 3. Three parallel boxes */}
          <div className="flex justify-center gap-2 bg-[#7b2d3a] p-4 rounded-lg">
            <FlowNode
              title="Zusammenstellen aller Infos und Fakten"
              variant="default"
              size="medium"
              className="bg-white text-[#7b2d3a] hover:bg-gray-100"
              onClick={() => handleNodeClick('zusammenstellen')}
            />
            <FlowNode
              title="Validieren der Infos und Fakten"
              variant="default"
              size="medium"
              className="bg-white text-[#7b2d3a] hover:bg-gray-100"
              onClick={() => handleNodeClick('validieren')}
            />
            <FlowNode
              title="Rollen- und Aufgabenverteilung vornehmen"
              variant="default"
              size="medium"
              className="bg-white text-[#7b2d3a] hover:bg-gray-100"
              onClick={() => handleNodeClick('rollen')}
            />
          </div>
          <Arrow />

          {/* 4. Strategie (Diamond) */}
          <div className="relative">
            <div className="w-32 h-32 bg-white border-2 border-[#7b2d3a] rotate-45 flex items-center justify-center cursor-pointer hover:bg-[#7b2d3a] group transition-colors"
                 onClick={() => handleNodeClick('strategie')}>
              <span className="-rotate-45 text-[#7b2d3a] group-hover:text-white text-xs text-center px-2 font-medium transition-colors">
                Krisenkommunikations-strategie festlegen
              </span>
            </div>
          </div>
          <Arrow />

          {/* 5. EXTERN and INTERN split */}
          <div className="flex justify-center gap-16 w-full">
            
            {/* EXTERN Column */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-bold text-[#7b2d3a] italic mb-4">EXTERN</h3>
              
              <div className="flex gap-4">
                {/* Left side - Categories */}
                <div className="bg-[#7b2d3a] rounded-lg p-2 space-y-2">
                  <FlowNode
                    title="Presse"
                    variant="default"
                    size="medium"
                    className="bg-white text-[#7b2d3a] hover:bg-gray-100 w-full"
                    onClick={() => handleNodeClick('extern.presse')}
                  />
                  <FlowNode
                    title="Internet"
                    variant="default"
                    size="medium"
                    className="bg-white text-[#7b2d3a] hover:bg-gray-100 w-full"
                    onClick={() => handleNodeClick('extern.internet')}
                  />
                  <FlowNode
                    title="Social Media"
                    variant="default"
                    size="medium"
                    className="bg-white text-[#7b2d3a] hover:bg-gray-100 w-full"
                    onClick={() => handleNodeClick('extern.socialMedia')}
                  />
                </div>
                
                {/* Right side - Outputs */}
                <div className="flex flex-col justify-around">
                  <FlowNode
                    title="PM / Statement"
                    variant="output"
                    size="small"
                    onClick={() => handleNodeClick('extern.presse')}
                  />
                  <FlowNode
                    title="Webseite / Pop-up"
                    variant="output"
                    size="small"
                    onClick={() => handleNodeClick('extern.internet')}
                  />
                  <FlowNode
                    title="Insta, LI, FB // Collabs"
                    variant="output"
                    size="small"
                    onClick={() => handleNodeClick('extern.socialMedia')}
                  />
                </div>
              </div>

              <Arrow />
              
              {/* Monitoring Extern */}
              <FlowNode
                title="Monitoring & Updates"
                variant="monitoring"
                size="medium"
                onClick={() => handleNodeClick('monitoringExtern')}
              />
            </div>

            {/* INTERN Column */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-bold text-[#7b2d3a] italic mb-4">INTERN</h3>
              
              <div className="flex gap-4">
                {/* Left side - Categories */}
                <div className="space-y-2">
                  <FlowNode
                    title="Info an die Organisations-leitungen und Führungskräfte"
                    variant="intern"
                    size="medium"
                    className="text-xs"
                    onClick={() => handleNodeClick('intern.organisationsleitung')}
                  />
                  <FlowNode
                    title="Info an die Belegschaft"
                    variant="intern"
                    size="medium"
                    onClick={() => handleNodeClick('intern.belegschaft')}
                  />
                </div>
                
                {/* Right side - Outputs */}
                <div className="flex flex-col justify-around">
                  <FlowNode
                    title="Mail / Chat"
                    variant="output"
                    size="small"
                    onClick={() => handleNodeClick('intern.organisationsleitung')}
                  />
                  <FlowNode
                    title="Mail / shl-mag"
                    variant="output"
                    size="small"
                    onClick={() => handleNodeClick('intern.belegschaft')}
                  />
                </div>
              </div>

              <Arrow />
              
              {/* Monitoring Intern */}
              <FlowNode
                title="Monitoring & Updates"
                variant="monitoring"
                size="medium"
                onClick={() => handleNodeClick('monitoringIntern')}
              />
            </div>
          </div>

          {/* Converging lines */}
          <div className="flex justify-center gap-32 w-full my-4">
            <div className="border-r-2 border-[#7b2d3a] w-32 h-8" />
            <div className="border-l-2 border-[#7b2d3a] w-32 h-8" />
          </div>
          
          {/* Bottom connecting line */}
          <div className="w-64 border-t-2 border-[#7b2d3a]" />
          <Arrow />

          {/* 6. Evaluation */}
          <FlowNode
            title="Evaluation & Anpassen der Kommunikationsmaßnahmen"
            variant="rectangle"
            size="wide"
            onClick={() => handleNodeClick('evaluation')}
          />
          <Arrow />

          {/* 7. Abschlussbericht (End) */}
          <FlowNode
            title="Abschlussbericht & Learnings"
            variant="oval"
            size="wide"
            onClick={() => handleNodeClick('abschlussbericht')}
          />
        </div>

        {/* Legend */}
        <div className="mt-8 pt-4 border-t flex justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#7b2d3a]" />
            <span>Start/Ende</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#7b2d3a] rounded" />
            <span>Prozessschritt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#c26d70] rounded-full" />
            <span>Output/Kanal</span>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeData={selectedNode}
        onNavigateToContent={onNavigateToContent}
      />
    </Card>
  );
};

export default CrisisFlowChart;

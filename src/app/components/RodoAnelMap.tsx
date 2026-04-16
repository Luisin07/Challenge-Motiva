import { getVegetationColor } from '../data/mockData';
import { TrechoData } from '../types/rodoanel';

interface RodoAnelMapProps {
  trechos: TrechoData[];
  selectedTrechoId?: string;
  onSelectTrecho: (id: string) => void;
}

export function RodoAnelMap({ trechos, selectedTrechoId, onSelectTrecho }: RodoAnelMapProps) {
  // SVG representation of Rodoanel (simplified ring)
  const centerX = 200;
  const centerY = 200;
  const radius = 120;

  // Calculate positions for each trecho around the ring
  const getTrechoPath = (index: number, total: number) => {
    const angleStart = (index / total) * 2 * Math.PI - Math.PI / 2;
    const angleEnd = ((index + 1) / total) * 2 * Math.PI - Math.PI / 2;
    
    const innerRadius = radius - 30;
    const outerRadius = radius + 30;
    
    const x1 = centerX + innerRadius * Math.cos(angleStart);
    const y1 = centerY + innerRadius * Math.sin(angleStart);
    const x2 = centerX + outerRadius * Math.cos(angleStart);
    const y2 = centerY + outerRadius * Math.sin(angleStart);
    const x3 = centerX + outerRadius * Math.cos(angleEnd);
    const y3 = centerY + outerRadius * Math.sin(angleEnd);
    const x4 = centerX + innerRadius * Math.cos(angleEnd);
    const y4 = centerY + innerRadius * Math.sin(angleEnd);
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  };

  const getLabelPosition = (index: number, total: number) => {
    const angle = ((index + 0.5) / total) * 2 * Math.PI - Math.PI / 2;
    const labelRadius = radius + 60;
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
    };
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-[500px]">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Center label */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className="fill-slate-700"
          fontSize="20"
          fontWeight="600"
        >
          Rodoanel
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          className="fill-slate-500"
          fontSize="14"
        >
          Mário Covas
        </text>
        
        {/* Trechos */}
        {trechos.map((trecho, index) => {
          const path = getTrechoPath(index, trechos.length);
          const labelPos = getLabelPosition(index, trechos.length);
          const color = getVegetationColor(trecho.currentClassification.level);
          const isSelected = trecho.segment.id === selectedTrechoId;
          
          return (
            <g key={trecho.segment.id}>
              <path
                d={path}
                fill={color}
                stroke={isSelected ? '#1e293b' : 'white'}
                strokeWidth={isSelected ? 3 : 2}
                className="cursor-pointer transition-all hover:opacity-80"
                onClick={() => onSelectTrecho(trecho.segment.id)}
                filter={isSelected ? 'url(#shadow)' : undefined}
                opacity={isSelected ? 1 : 0.9}
              />
              
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                className="fill-slate-700 pointer-events-none"
                fontSize="12"
                fontWeight="500"
              >
                {trecho.segment.region}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

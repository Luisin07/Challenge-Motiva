import { TrechoData } from '../types/rodoanel';
import { getVegetationColor, getVegetationLabel } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HistoryTimelineProps {
  trecho: TrechoData;
}

export function HistoryTimeline({ trecho }: HistoryTimelineProps) {
  const allData = [
    {
      date: trecho.currentClassification.timestamp,
      classification: trecho.currentClassification,
      ndvi: trecho.ndviData,
      isCurrent: true,
    },
    ...trecho.historicalData.map(h => ({
      date: h.date,
      classification: h.classification,
      ndvi: h.ndvi,
      isCurrent: false,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTrend = (current: number, previous?: number) => {
    if (!previous) return null;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Classificações</CardTitle>
        <CardDescription>
          Evolução temporal do trecho {trecho.segment.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allData.map((entry, index) => {
            const nextEntry = allData[index + 1];
            const trend = getTrend(
              entry.classification.level,
              nextEntry?.classification.level
            );
            const color = getVegetationColor(entry.classification.level);
            const label = getVegetationLabel(entry.classification.level);

            return (
              <div key={entry.date} className="relative">
                {/* Timeline connector */}
                {index < allData.length - 1 && (
                  <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-slate-200" />
                )}

                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      <span className="text-white text-xs font-bold">
                        {entry.classification.level}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900">
                              {label} (Nível {entry.classification.level})
                            </span>
                            {entry.isCurrent && (
                              <Badge variant="default" className="text-xs">
                                Atual
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </div>

                        {trend && (
                          <div className="flex items-center gap-1">
                            {trend === 'up' && (
                              <>
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">
                                  Melhorou
                                </span>
                              </>
                            )}
                            {trend === 'down' && (
                              <>
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                <span className="text-xs text-red-600 font-medium">
                                  Piorou
                                </span>
                              </>
                            )}
                            {trend === 'stable' && (
                              <>
                                <Minus className="w-4 h-4 text-slate-600" />
                                <span className="text-xs text-slate-600 font-medium">
                                  Estável
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-slate-600">NDVI</div>
                          <div className="font-semibold text-slate-900">
                            {entry.ndvi.value.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Cobertura</div>
                          <div className="font-semibold text-slate-900">
                            {entry.ndvi.coverage}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Confiança</div>
                          <div className="font-semibold text-slate-900">
                            {entry.classification.confidence}%
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-slate-700 mb-2">
                        {entry.classification.justification}
                      </div>

                      <Badge variant="outline" className="text-xs">
                        {entry.classification.model}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {allData.length === 1 && (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">Nenhum histórico disponível</p>
              <p className="text-xs mt-1">
                Este é o primeiro monitoramento registrado
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

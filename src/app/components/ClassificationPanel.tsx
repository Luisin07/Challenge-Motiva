import { LLMClassification } from '../types/rodoanel';
import { getVegetationColor, getVegetationLabel } from '../data/mockData';
import { Badge } from './ui/badge';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface ClassificationPanelProps {
  classification: LLMClassification;
}

export function ClassificationPanel({ classification }: ClassificationPanelProps) {
  const color = getVegetationColor(classification.level);
  const label = getVegetationLabel(classification.level);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <CardTitle>Classificação via LLM Multimodal</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {classification.model}
            </Badge>
          </div>
          <CardDescription>
            Análise automatizada com IA de visão computacional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level and Confidence */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Nível de Vegetação</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color }}
                >
                  {label} (Nível {classification.level})
                </span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600">Confiança</span>
                <span className="text-xs font-medium text-slate-900">
                  {classification.confidence}%
                </span>
              </div>
              <Progress value={classification.confidence} className="h-2" />
            </div>
          </div>

          {/* Justification */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-slate-900 mb-1">
                  Justificativa Técnica
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {classification.justification}
                </p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">Detalhes Técnicos</div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-600 mb-1">NDVI Médio</div>
                <div className="font-semibold text-slate-900">
                  {classification.technicalDetails.ndviAverage.toFixed(2)}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-600 mb-1">Cobertura de Dossel</div>
                <div className="font-semibold text-slate-900">
                  {classification.technicalDetails.canopyCoverage}%
                </div>
              </div>
            </div>

            {/* Species Identified */}
            <div>
              <div className="text-xs text-slate-600 mb-2">Espécies Identificadas</div>
              <div className="flex flex-wrap gap-2">
                {classification.technicalDetails.speciesIdentified.map((species, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {species}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Health Indicators */}
            <div>
              <div className="text-xs text-slate-600 mb-2">Indicadores de Saúde</div>
              <div className="space-y-1">
                {classification.technicalDetails.healthIndicators.map((indicator, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {indicator}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {classification.recommendations.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-amber-900 mb-2">
                    Recomendações
                  </div>
                  <ul className="space-y-1">
                    {classification.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200">
            Análise realizada em {new Date(classification.timestamp).toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

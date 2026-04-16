import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockTrechoData, dashboardMetrics } from '../data/mockData';
import { RodoAnelMap } from '../components/RodoAnelMap';
import { MetricsPanel } from '../components/MetricsPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Satellite, MapPin, Eye, RefreshCw } from 'lucide-react';
import { getVegetationLabel, getVegetationColor } from '../data/mockData';

export default function Dashboard() {
  const [selectedTrechoId, setSelectedTrechoId] = useState<string | undefined>(
    mockTrechoData[0].segment.id
  );
  const navigate = useNavigate();

  const selectedTrecho = mockTrechoData.find(
    (t) => t.segment.id === selectedTrechoId
  );

  const handleViewDetails = () => {
    if (selectedTrechoId) {
      navigate(`/trecho/${selectedTrechoId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Sistema de Monitoramento de Vegetação
              </h1>
              <p className="text-sm text-slate-600">
                Rodoanel Mário Covas - Análise via Satélite + IA
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Satellite className="w-3 h-3" />
                Google Earth Engine
              </Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Dados
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics */}
        <MetricsPanel metrics={dashboardMetrics} trechos={mockTrechoData} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Map */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Mapa do Rodoanel
              </CardTitle>
              <CardDescription>
                Selecione um trecho para visualizar detalhes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <RodoAnelMap
                  trechos={mockTrechoData}
                  selectedTrechoId={selectedTrechoId}
                  onSelectTrecho={setSelectedTrechoId}
                />
              </div>
            </CardContent>
          </Card>

          {/* Trecho Summary */}
          {selectedTrecho && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedTrecho.segment.name}</CardTitle>
                  <Badge
                    style={{
                      backgroundColor: getVegetationColor(
                        selectedTrecho.currentClassification.level
                      ),
                      color: 'white',
                    }}
                  >
                    {getVegetationLabel(selectedTrecho.currentClassification.level)}
                  </Badge>
                </div>
                <CardDescription>
                  {selectedTrecho.segment.region} · {selectedTrecho.segment.length} km
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-xs text-slate-600 mb-1">NDVI Atual</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {selectedTrecho.ndviData.value.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-xs text-slate-600 mb-1">Cobertura</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {selectedTrecho.ndviData.coverage}%
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-xs text-slate-600 mb-1">Confiança IA</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {selectedTrecho.currentClassification.confidence}%
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-xs text-slate-600 mb-1">Modelo</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {selectedTrecho.currentClassification.model}
                    </div>
                  </div>
                </div>

                {/* Satellite Image Preview */}
                <div className="relative rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={selectedTrecho.satelliteImage.url}
                    alt={selectedTrecho.segment.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-slate-700">
                    {selectedTrecho.satelliteImage.source}
                  </div>
                </div>

                {/* Justification */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    Análise Automatizada
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {selectedTrecho.currentClassification.justification.substring(
                      0,
                      200
                    )}
                    ...
                  </p>
                </div>

                {/* Actions */}
                <Button className="w-full" onClick={handleViewDetails}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Análise Completa
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trechos List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Todos os Trechos</CardTitle>
            <CardDescription>
              Visão geral de todos os {mockTrechoData.length} trechos monitorados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTrechoData.map((trecho) => {
                const color = getVegetationColor(
                  trecho.currentClassification.level
                );
                const label = getVegetationLabel(
                  trecho.currentClassification.level
                );

                return (
                  <button
                    key={trecho.segment.id}
                    onClick={() => navigate(`/trecho/${trecho.segment.id}`)}
                    className="text-left bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {trecho.segment.name.split(' - ')[0]}
                        </div>
                        <div className="text-xs text-slate-600">
                          {trecho.segment.length} km
                        </div>
                      </div>
                      <Badge
                        style={{
                          backgroundColor: color,
                          color: 'white',
                        }}
                        className="text-xs"
                      >
                        {label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-600">NDVI:</span>
                        <span className="font-medium text-slate-900 ml-1">
                          {trecho.ndviData.value.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">Cob:</span>
                        <span className="font-medium text-slate-900 ml-1">
                          {trecho.ndviData.coverage}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

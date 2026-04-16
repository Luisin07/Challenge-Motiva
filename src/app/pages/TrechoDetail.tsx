import { useParams, useNavigate } from 'react-router';
import { mockTrechoData } from '../data/mockData';
import { SatelliteView } from '../components/SatelliteView';
import { ClassificationPanel } from '../components/ClassificationPanel';
import { HistoryTimeline } from '../components/HistoryTimeline';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { getVegetationColor, getVegetationLabel } from '../data/mockData';

export default function TrechoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const trecho = mockTrechoData.find((t) => t.segment.id === id);

  if (!trecho) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Trecho não encontrado
          </h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const color = getVegetationColor(trecho.currentClassification.level);
  const label = getVegetationLabel(trecho.currentClassification.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {trecho.segment.name}
                  </h1>
                  <Badge
                    style={{
                      backgroundColor: color,
                      color: 'white',
                    }}
                  >
                    {label} (Nível {trecho.currentClassification.level})
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  {trecho.segment.region} · {trecho.segment.length} km · Última
                  atualização:{' '}
                  {new Date(
                    trecho.currentClassification.timestamp
                  ).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>NDVI Atual</CardDescription>
              <CardTitle className="text-3xl">
                {trecho.ndviData.value.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Cobertura Vegetal</CardDescription>
              <CardTitle className="text-3xl">{trecho.ndviData.coverage}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Confiança IA</CardDescription>
              <CardTitle className="text-3xl">
                {trecho.currentClassification.confidence}%
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Modelo Utilizado</CardDescription>
              <CardTitle className="text-lg">
                {trecho.currentClassification.model}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="analysis">Análise</TabsTrigger>
            <TabsTrigger value="satellite">Satélite</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClassificationPanel
                classification={trecho.currentClassification}
              />
              
              <div className="space-y-6">
                {/* NDVI Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Composição da Vegetação</CardTitle>
                    <CardDescription>
                      Distribuição percentual do índice NDVI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-700">
                          Vegetação Saudável
                        </span>
                        <span className="font-semibold text-slate-900">
                          {trecho.ndviData.healthyVegetation}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{
                            width: `${trecho.ndviData.healthyVegetation}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-700">
                          Vegetação Esparsa
                        </span>
                        <span className="font-semibold text-slate-900">
                          {trecho.ndviData.sparseVegetation}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-yellow-500 h-3 rounded-full"
                          style={{
                            width: `${trecho.ndviData.sparseVegetation}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-700">Solo Exposto</span>
                        <span className="font-semibold text-slate-900">
                          {trecho.ndviData.bareGround}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-orange-500 h-3 rounded-full"
                          style={{ width: `${trecho.ndviData.bareGround}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Satellite Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dados do Satélite</CardTitle>
                    <CardDescription>
                      Informações da captura de imagem
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Fonte</span>
                      <span className="font-semibold text-slate-900">
                        {trecho.satelliteImage.source}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Data de Captura</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(
                          trecho.satelliteImage.captureDate
                        ).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Resolução</span>
                      <span className="font-semibold text-slate-900">
                        {trecho.satelliteImage.resolution}m/pixel
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        Cobertura de Nuvens
                      </span>
                      <span className="font-semibold text-slate-900">
                        {trecho.satelliteImage.cloudCoverage}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="satellite">
            <SatelliteView
              image={trecho.satelliteImage}
              ndvi={trecho.ndviData}
              segmentName={trecho.segment.name}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTimeline trecho={trecho} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

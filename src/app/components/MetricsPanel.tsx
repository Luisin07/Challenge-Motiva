import { DashboardMetrics, TrechoData } from '../types/rodoanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MetricsPanelProps {
  metrics: DashboardMetrics;
  trechos: TrechoData[];
}

export function MetricsPanel({ metrics, trechos }: MetricsPanelProps) {
  const getTrendIcon = () => {
    switch (metrics.trendDirection) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTrendLabel = () => {
    switch (metrics.trendDirection) {
      case 'improving':
        return 'Melhorando';
      case 'declining':
        return 'Degradando';
      case 'stable':
        return 'Estável';
    }
  };

  // Prepare data for vegetation distribution pie chart
  const vegetationDistribution = [
    { name: 'Excelente (5)', value: trechos.filter(t => t.currentClassification.level === 5).length, color: '#22c55e' },
    { name: 'Bom (4)', value: trechos.filter(t => t.currentClassification.level === 4).length, color: '#84cc16' },
    { name: 'Moderado (3)', value: trechos.filter(t => t.currentClassification.level === 3).length, color: '#eab308' },
    { name: 'Baixo (2)', value: trechos.filter(t => t.currentClassification.level === 2).length, color: '#f97316' },
    { name: 'Crítico (1)', value: trechos.filter(t => t.currentClassification.level === 1).length, color: '#dc2626' },
  ].filter(item => item.value > 0);

  // Prepare historical trend data (last 6 months)
  const historicalTrend = [
    { month: 'Nov/25', ndvi: 0.58 },
    { month: 'Dez/25', ndvi: 0.60 },
    { month: 'Jan/26', ndvi: 0.61 },
    { month: 'Fev/26', ndvi: 0.62 },
    { month: 'Mar/26', ndvi: 0.64 },
    { month: 'Abr/26', ndvi: 0.65 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Extensão Total</CardDescription>
            <CardTitle className="text-3xl">{metrics.totalLength} km</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>NDVI Médio</CardDescription>
            <CardTitle className="text-3xl">{metrics.averageNDVI.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Taxa de Conformidade</CardDescription>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-3xl">{metrics.complianceRate}%</CardTitle>
              {metrics.complianceRate >= 80 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Trechos Críticos</CardDescription>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-3xl">{metrics.criticalTrechos}</CardTitle>
              {getTrendIcon()}
              <span className="text-sm text-slate-600">{getTrendLabel()}</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vegetation Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Nível</CardTitle>
            <CardDescription>
              Classificação dos {trechos.length} trechos monitorados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vegetationDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vegetationDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Historical Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência NDVI (6 meses)</CardTitle>
            <CardDescription>
              Evolução média da vegetação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={historicalTrend}>
                <defs>
                  <linearGradient id="colorNDVI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="ndvi" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorNDVI)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* NDVI by Trecho */}
      <Card>
        <CardHeader>
          <CardTitle>NDVI por Trecho</CardTitle>
          <CardDescription>
            Comparação dos índices de vegetação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={trechos.map(t => ({
                name: t.segment.name.split(' - ')[0],
                ndvi: t.ndviData.value,
                coverage: t.ndviData.coverage,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" domain={[0, 1]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="ndvi" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="NDVI"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="coverage" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Cobertura (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

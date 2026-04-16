import { TrechoData, DashboardMetrics, TrechoSegment } from '../types/rodoanel';

// Mock satellite images from Unsplash
const satelliteImages = [
  'https://images.unsplash.com/photo-1652856391465-3ed43e96902b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBoaWdod2F5JTIwZm9yZXN0JTIwYWVyaWFsfGVufDF8fHx8MTc3NjM0NDYyNnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1694278620642-7e7547971197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjB2ZWdldGF0aW9uJTIwZ3JlZW4lMjBuYXR1cmV8ZW58MXx8fHwxNzc2MzQ0NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1659819977096-3ac3c5782c41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBoaWdod2F5JTIwcm9hZCUyMHZlZ2V0YXRpb258ZW58MXx8fHwxNzc2MzQ0NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1593198095345-311f4d23d511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBlYXJ0aCUyMG1vbml0b3JpbmclMjBmb3Jlc3R8ZW58MXx8fHwxNzc2MzQ0NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
];

export const trechoSegments: TrechoSegment[] = [
  {
    id: 'norte-01',
    name: 'Trecho Norte - Km 0-15',
    region: 'Norte',
    length: 15,
    coordinates: [
      { lat: -23.4, lng: -46.5 },
      { lat: -23.35, lng: -46.45 },
    ],
  },
  {
    id: 'sul-01',
    name: 'Trecho Sul - Km 0-20',
    region: 'Sul',
    length: 20,
    coordinates: [
      { lat: -23.7, lng: -46.6 },
      { lat: -23.75, lng: -46.55 },
    ],
  },
  {
    id: 'leste-01',
    name: 'Trecho Leste - Km 0-18',
    region: 'Leste',
    length: 18,
    coordinates: [
      { lat: -23.5, lng: -46.4 },
      { lat: -23.55, lng: -46.35 },
    ],
  },
  {
    id: 'oeste-01',
    name: 'Trecho Oeste - Km 0-25',
    region: 'Oeste',
    length: 25,
    coordinates: [
      { lat: -23.55, lng: -46.75 },
      { lat: -23.5, lng: -46.8 },
    ],
  },
  {
    id: 'norte-02',
    name: 'Trecho Norte - Km 15-30',
    region: 'Norte',
    length: 15,
    coordinates: [
      { lat: -23.35, lng: -46.45 },
      { lat: -23.3, lng: -46.4 },
    ],
  },
  {
    id: 'sul-02',
    name: 'Trecho Sul - Km 20-35',
    region: 'Sul',
    length: 15,
    coordinates: [
      { lat: -23.75, lng: -46.55 },
      { lat: -23.8, lng: -46.5 },
    ],
  },
];

export const mockTrechoData: TrechoData[] = [
  {
    segment: trechoSegments[0],
    currentClassification: {
      level: 4,
      confidence: 92,
      justification: 'Análise de imagem via GPT-4o Vision identificou cobertura vegetal densa e saudável ao longo de 87% da extensão do trecho. Presença significativa de dossel contínuo com alta reflectância no espectro infravermelho próximo, indicativo de vegetação ativa em processo fotossintético.',
      technicalDetails: {
        ndviAverage: 0.72,
        canopyCoverage: 87,
        speciesIdentified: [
          'Eucalyptus sp.',
          'Mata Atlântica secundária',
          'Espécies nativas regeneradas',
        ],
        healthIndicators: [
          'Alta densidade foliar',
          'Ausência de stress hídrico',
          'Crescimento vigoroso',
          'Baixa presença de solo exposto',
        ],
      },
      recommendations: [
        'Manter monitoramento mensal',
        'Continuar manejo preventivo atual',
        'Reforçar controle de espécies invasoras nas bordas',
      ],
      timestamp: '2026-04-15T14:30:00Z',
      model: 'GPT-4o',
    },
    satelliteImage: {
      url: satelliteImages[0],
      captureDate: '2026-04-14',
      source: 'Google Earth Engine',
      resolution: 10,
      cloudCoverage: 5,
    },
    ndviData: {
      value: 0.72,
      timestamp: '2026-04-14T10:00:00Z',
      coverage: 87,
      healthyVegetation: 72,
      sparseVegetation: 15,
      bareGround: 13,
    },
    historicalData: [
      {
        date: '2026-03-15',
        classification: {
          level: 4,
          confidence: 89,
          justification: 'Vegetação densa mantida.',
          technicalDetails: {
            ndviAverage: 0.71,
            canopyCoverage: 85,
            speciesIdentified: ['Eucalyptus sp.', 'Mata Atlântica secundária'],
            healthIndicators: ['Alta densidade foliar'],
          },
          recommendations: ['Manter monitoramento'],
          timestamp: '2026-03-15T14:30:00Z',
          model: 'GPT-4o',
        },
        ndvi: {
          value: 0.71,
          timestamp: '2026-03-14T10:00:00Z',
          coverage: 85,
          healthyVegetation: 70,
          sparseVegetation: 15,
          bareGround: 15,
        },
      },
      {
        date: '2026-02-15',
        classification: {
          level: 3,
          confidence: 85,
          justification: 'Vegetação em recuperação após período de seca.',
          technicalDetails: {
            ndviAverage: 0.65,
            canopyCoverage: 78,
            speciesIdentified: ['Eucalyptus sp.'],
            healthIndicators: ['Stress hídrico moderado'],
          },
          recommendations: ['Monitorar recuperação'],
          timestamp: '2026-02-15T14:30:00Z',
          model: 'GPT-4o',
        },
        ndvi: {
          value: 0.65,
          timestamp: '2026-02-14T10:00:00Z',
          coverage: 78,
          healthyVegetation: 65,
          sparseVegetation: 13,
          bareGround: 22,
        },
      },
    ],
  },
  {
    segment: trechoSegments[1],
    currentClassification: {
      level: 2,
      confidence: 88,
      justification: 'Classificação Gemini Vision detectou vegetação esparsa com trechos significativos de solo exposto. NDVI médio de 0.42 indica vegetação em estado de stress ou cobertura parcial. Foram identificadas áreas críticas nos Km 5-8 e Km 12-15 com necessidade de intervenção imediata.',
      technicalDetails: {
        ndviAverage: 0.42,
        canopyCoverage: 48,
        speciesIdentified: [
          'Gramíneas invasoras',
          'Vegetação herbácea',
          'Mudas recém-plantadas',
        ],
        healthIndicators: [
          'Cobertura fragmentada',
          'Solo exposto em >40% do trecho',
          'Presença de erosão pontual',
          'Mudas com baixa taxa de sobrevivência',
        ],
      },
      recommendations: [
        'Executar replantio emergencial nos Km 5-8 e Km 12-15',
        'Implementar sistema de irrigação temporária',
        'Controlar espécies invasoras competidoras',
        'Aumentar frequência de monitoramento para quinzenal',
      ],
      timestamp: '2026-04-15T15:00:00Z',
      model: 'Gemini-Vision',
    },
    satelliteImage: {
      url: satelliteImages[1],
      captureDate: '2026-04-14',
      source: 'Sentinel-2',
      resolution: 10,
      cloudCoverage: 8,
    },
    ndviData: {
      value: 0.42,
      timestamp: '2026-04-14T10:00:00Z',
      coverage: 48,
      healthyVegetation: 35,
      sparseVegetation: 13,
      bareGround: 52,
    },
    historicalData: [
      {
        date: '2026-03-15',
        classification: {
          level: 2,
          confidence: 84,
          justification: 'Vegetação esparsa persistente.',
          technicalDetails: {
            ndviAverage: 0.41,
            canopyCoverage: 46,
            speciesIdentified: ['Gramíneas invasoras'],
            healthIndicators: ['Solo exposto significativo'],
          },
          recommendations: ['Executar replantio'],
          timestamp: '2026-03-15T15:00:00Z',
          model: 'Gemini-Vision',
        },
        ndvi: {
          value: 0.41,
          timestamp: '2026-03-14T10:00:00Z',
          coverage: 46,
          healthyVegetation: 33,
          sparseVegetation: 13,
          bareGround: 54,
        },
      },
    ],
  },
  {
    segment: trechoSegments[2],
    currentClassification: {
      level: 5,
      confidence: 95,
      justification: 'Análise GPT-4o Vision confirmou vegetação em estado ótimo com NDVI excepcional de 0.83. Cobertura vegetal contínua de 94% com dossel maduro e estratificação vertical bem desenvolvida. Este trecho representa o padrão de excelência do projeto de recuperação.',
      technicalDetails: {
        ndviAverage: 0.83,
        canopyCoverage: 94,
        speciesIdentified: [
          'Mata Atlântica madura',
          'Espécies nativas diversificadas',
          'Sub-bosque desenvolvido',
        ],
        healthIndicators: [
          'Densidade foliar excepcional',
          'Estrutura vertical complexa',
          'Alta biodiversidade observada',
          'Solo 100% protegido',
          'Presença de fauna indicadora',
        ],
      },
      recommendations: [
        'Documentar como caso de sucesso',
        'Replicar práticas de manejo nos demais trechos',
        'Manter protocolo de monitoramento trimestral',
      ],
      timestamp: '2026-04-15T16:00:00Z',
      model: 'GPT-4o',
    },
    satelliteImage: {
      url: satelliteImages[2],
      captureDate: '2026-04-14',
      source: 'Google Earth Engine',
      resolution: 10,
      cloudCoverage: 3,
    },
    ndviData: {
      value: 0.83,
      timestamp: '2026-04-14T10:00:00Z',
      coverage: 94,
      healthyVegetation: 88,
      sparseVegetation: 6,
      bareGround: 6,
    },
    historicalData: [
      {
        date: '2026-03-15',
        classification: {
          level: 5,
          confidence: 94,
          justification: 'Vegetação ótima mantida.',
          technicalDetails: {
            ndviAverage: 0.82,
            canopyCoverage: 93,
            speciesIdentified: ['Mata Atlântica madura'],
            healthIndicators: ['Densidade excepcional'],
          },
          recommendations: ['Manter monitoramento'],
          timestamp: '2026-03-15T16:00:00Z',
          model: 'GPT-4o',
        },
        ndvi: {
          value: 0.82,
          timestamp: '2026-03-14T10:00:00Z',
          coverage: 93,
          healthyVegetation: 87,
          sparseVegetation: 6,
          bareGround: 7,
        },
      },
    ],
  },
  {
    segment: trechoSegments[3],
    currentClassification: {
      level: 3,
      confidence: 87,
      justification: 'Gemini Vision identificou vegetação moderada com cobertura de 68%. NDVI de 0.58 indica vegetação em desenvolvimento ativo, mas ainda sem atingir maturidade. Áreas com replantio recente apresentam boa taxa de estabelecimento.',
      technicalDetails: {
        ndviAverage: 0.58,
        canopyCoverage: 68,
        speciesIdentified: [
          'Mudas nativas (2-3 anos)',
          'Eucalyptus sp.',
          'Espécies pioneiras',
        ],
        healthIndicators: [
          'Crescimento ativo',
          'Estabelecimento adequado',
          'Cobertura em expansão',
          'Solo parcialmente protegido',
        ],
      },
      recommendations: [
        'Continuar adensamento nas áreas de baixa cobertura',
        'Manter irrigação de apoio',
        'Monitoramento mensal até atingir nível 4',
      ],
      timestamp: '2026-04-15T17:00:00Z',
      model: 'Gemini-Vision',
    },
    satelliteImage: {
      url: satelliteImages[3],
      captureDate: '2026-04-14',
      source: 'Landsat-8',
      resolution: 30,
      cloudCoverage: 12,
    },
    ndviData: {
      value: 0.58,
      timestamp: '2026-04-14T10:00:00Z',
      coverage: 68,
      healthyVegetation: 52,
      sparseVegetation: 16,
      bareGround: 32,
    },
    historicalData: [
      {
        date: '2026-03-15',
        classification: {
          level: 3,
          confidence: 85,
          justification: 'Vegetação em desenvolvimento.',
          technicalDetails: {
            ndviAverage: 0.56,
            canopyCoverage: 65,
            speciesIdentified: ['Mudas nativas'],
            healthIndicators: ['Crescimento ativo'],
          },
          recommendations: ['Continuar adensamento'],
          timestamp: '2026-03-15T17:00:00Z',
          model: 'Gemini-Vision',
        },
        ndvi: {
          value: 0.56,
          timestamp: '2026-03-14T10:00:00Z',
          coverage: 65,
          healthyVegetation: 50,
          sparseVegetation: 15,
          bareGround: 35,
        },
      },
    ],
  },
  {
    segment: trechoSegments[4],
    currentClassification: {
      level: 4,
      confidence: 90,
      justification: 'GPT-4o Vision detectou vegetação densa com excelente uniformidade. NDVI de 0.75 e cobertura de 89% demonstram efetividade das ações de recuperação implementadas nos últimos 18 meses.',
      technicalDetails: {
        ndviAverage: 0.75,
        canopyCoverage: 89,
        speciesIdentified: ['Mata Atlântica secundária', 'Espécies nativas'],
        healthIndicators: [
          'Alta densidade',
          'Crescimento uniforme',
          'Boa saúde geral',
        ],
      },
      recommendations: [
        'Manter monitoramento mensal',
        'Avaliar transição para nível 5',
      ],
      timestamp: '2026-04-15T18:00:00Z',
      model: 'GPT-4o',
    },
    satelliteImage: {
      url: satelliteImages[0],
      captureDate: '2026-04-14',
      source: 'Google Earth Engine',
      resolution: 10,
      cloudCoverage: 6,
    },
    ndviData: {
      value: 0.75,
      timestamp: '2026-04-14T10:00:00Z',
      coverage: 89,
      healthyVegetation: 75,
      sparseVegetation: 14,
      bareGround: 11,
    },
    historicalData: [],
  },
  {
    segment: trechoSegments[5],
    currentClassification: {
      level: 3,
      confidence: 86,
      justification: 'Gemini Vision identificou vegetação moderada com tendência de melhoria. Replantio recente apresenta taxa de pegamento de 78%.',
      technicalDetails: {
        ndviAverage: 0.61,
        canopyCoverage: 71,
        speciesIdentified: ['Mudas nativas recentes', 'Espécies pioneiras'],
        healthIndicators: ['Estabelecimento em curso', 'Tendência positiva'],
      },
      recommendations: [
        'Intensificar manutenção nas primeiras 6 semanas',
        'Monitoramento quinzenal',
      ],
      timestamp: '2026-04-15T19:00:00Z',
      model: 'Gemini-Vision',
    },
    satelliteImage: {
      url: satelliteImages[1],
      captureDate: '2026-04-14',
      source: 'Sentinel-2',
      resolution: 10,
      cloudCoverage: 9,
    },
    ndviData: {
      value: 0.61,
      timestamp: '2026-04-14T10:00:00Z',
      coverage: 71,
      healthyVegetation: 55,
      sparseVegetation: 16,
      bareGround: 29,
    },
    historicalData: [],
  },
];

export const dashboardMetrics: DashboardMetrics = {
  totalLength: 108,
  averageNDVI: 0.65,
  criticalTrechos: 1,
  lastUpdate: '2026-04-15T19:00:00Z',
  complianceRate: 83,
  trendDirection: 'improving',
};

export const getVegetationColor = (level: number): string => {
  switch (level) {
    case 1:
      return '#dc2626'; // red-600
    case 2:
      return '#f97316'; // orange-500
    case 3:
      return '#eab308'; // yellow-500
    case 4:
      return '#84cc16'; // lime-500
    case 5:
      return '#22c55e'; // green-500
    default:
      return '#94a3b8'; // slate-400
  }
};

export const getVegetationLabel = (level: number): string => {
  switch (level) {
    case 1:
      return 'Crítico';
    case 2:
      return 'Baixo';
    case 3:
      return 'Moderado';
    case 4:
      return 'Bom';
    case 5:
      return 'Excelente';
    default:
      return 'N/A';
  }
};

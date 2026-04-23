# VegeTrack — Challenge Motiva x FIAP

> Sistema inteligente de monitoramento e gestão de vegetação para rodovias.

Desenvolvido para o Challenge Motiva x FIAP — 2º Ano Ciência da Computação.
Piloto no Rodoanel Mário Covas (SP-021) — escalável para todas as concessões da Motiva.

🌐 **Deploy:** https://challenge-motiva.vercel.app

## Sobre o projeto

A Motiva gerencia mais de 5 mil km de rodovias no Brasil. Hoje o controle de vegetação é feito por planilhas manuais e cronogramas fixos, sem considerar se a vegetação realmente precisa de intervenção.

O VegeTrack resolve isso com dados reais, monitoramento contínuo e automação de ordens de serviço.

## O que o sistema faz

- Processa dados reais de levantamento de vegetação do Rodoanel
- Identifica trechos críticos com base em nível atual e taxa de crescimento
- Gera Ordens de Serviço automáticas com prazo, método, equipes e EPI
- Monitora conformidade contratual com alertas de violações iminentes ARTESP/ANTT
- Monitora fauna e flora com dados científicos reais da GBIF
- Emite alertas de restrição ambiental por época do ano
- Exibe 30+ avistamentos reais de animais na região com coordenada GPS

## Stack

- **Backend:** Python, FastAPI, Pandas
- **Frontend:** React, Recharts, Leaflet
- **Dados:** XLSXs reais da Motiva, KMZ geoespacial, GBIF API
- **Deploy:** Vercel (frontend) + Render (backend)

## Como rodar localmente

### Backend

```bash
cd backend
pip install fastapi uvicorn pandas openpyxl httpx
python -m uvicorn main:app --reload
```

API disponível em `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm start
```

Sistema disponível em `http://localhost:3000`

## Endpoints da API

| Endpoint | Descrição |
|----------|-----------|
| GET /resumo | Indicadores gerais do Rodoanel |
| GET /trechos | Todos os 248 trechos monitorados |
| GET /criticos | 43 trechos críticos |
| GET /ordens | Ordens de serviço priorizadas |
| GET /conformidade | Violações iminentes ARTESP/ANTT |
| GET /previsao | Previsão de criticidade por trecho |
| GET /fauna/status | Status ambiental do mês atual |
| GET /fauna/especies | Espécies monitoradas na região |
| GET /fauna/calendario | Calendário de restrições ambientais |
| GET /fauna/alerta | Alerta ambiental para intervenções |
| GET /fauna/gbif | Avistamentos reais via GBIF API |
| GET /mapa/pontos | 641 pontos geoespaciais do Rodoanel |

## Time

FIAP — 2º Ano Ciência da Computação
Challenge Motiva 2026

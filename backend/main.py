from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.xlsx_processor import calcular_crescimento, get_resumo, gerar_ordem_servico
from services.fauna_flora import get_status_atual, get_todas_especies, get_calendario, get_alerta_os
from services.gbif_service import buscar_ocorrencias_gbif

app = FastAPI(title="Challenge Motiva API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "GreenWatch API rodando"}

@app.get("/resumo")
def resumo():
    return get_resumo()

@app.get("/trechos")
def trechos():
    return calcular_crescimento()

@app.get("/criticos")
def criticos():
    return [t for t in calcular_crescimento() if t['critico']]

@app.get("/ordens")
def ordens():
    return gerar_ordem_servico()

@app.get("/fauna/status")
def fauna_status():
    return get_status_atual()

@app.get("/fauna/especies")
def fauna_especies():
    return get_todas_especies()

@app.get("/fauna/calendario")
def fauna_calendario():
    return get_calendario()

@app.get("/fauna/alerta")
def fauna_alerta():
    return get_alerta_os()

@app.get("/fauna/gbif")
async def fauna_gbif():
    return await buscar_ocorrencias_gbif()

from services.xlsx_processor import calcular_crescimento, get_resumo, gerar_ordem_servico, get_conformidade

@app.get("/conformidade")
def conformidade():
    return get_conformidade()
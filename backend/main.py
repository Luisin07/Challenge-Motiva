from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.xlsx_processor import calcular_crescimento, get_resumo

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
    dados = calcular_crescimento()
    return [t for t in dados if t['critico']]

from services.xlsx_processor import calcular_crescimento, get_resumo, gerar_ordem_servico

@app.get("/ordens")
def ordens():
    return gerar_ordem_servico()
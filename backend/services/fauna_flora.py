from datetime import datetime

ESPECIES = [
    {
        "nome": "Sabiá-laranjeira",
        "tipo": "Ave",
        "periodo_reproducao": [8, 9, 10, 11, 12],
        "risco": "ALTO",
        "descricao": "Nidifica em arbustos baixos nas margens da rodovia",
        "recomendacao": "Evitar roçada entre agosto e dezembro. Se necessário, usar roçada manual seletiva."
    },
    {
        "nome": "Gambá-de-orelha-branca",
        "tipo": "Mamífero",
        "periodo_reproducao": [7, 8, 9, 10],
        "risco": "ALTO",
        "descricao": "Utiliza a vegetação marginal como corredor ecológico",
        "recomendacao": "Realizar roçada no período diurno. Verificar presença de filhotes antes de iniciar."
    },
    {
        "nome": "Capivara",
        "tipo": "Mamífero",
        "periodo_reproducao": [1, 2, 3, 4],
        "risco": "MEDIO",
        "descricao": "Frequenta canteiros próximos a cursos d'água",
        "recomendacao": "Sinalizar equipe sobre presença. Manter distância de segurança de 10 metros."
    },
    {
        "nome": "Cobras (Jararaca)",
        "tipo": "Réptil",
        "periodo_reproducao": [10, 11, 12, 1, 2],
        "risco": "CRITICO",
        "descricao": "Utiliza vegetação densa como abrigo. Risco direto para trabalhadores.",
        "recomendacao": "EPI reforçado obrigatório — perneira e luva grossa. Roçada mecanizada preferencial. Acionar médico do trabalho."
    },
    {
        "nome": "Tesourinha (Ave)",
        "tipo": "Ave",
        "periodo_reproducao": [9, 10, 11],
        "risco": "MEDIO",
        "descricao": "Nidifica próxima ao solo em vegetação rasteira",
        "recomendacao": "Inspecionar área antes da roçada. Relocar ninhos ativos se possível."
    },
    {
        "nome": "Tatu-galinha",
        "tipo": "Mamífero",
        "periodo_reproducao": [6, 7, 8],
        "risco": "BAIXO",
        "descricao": "Escava tocas nas margens gramadas da rodovia",
        "recomendacao": "Verificar presença de tocas antes da roçada mecanizada para evitar danos ao equipamento."
    },
]

RESTRICOES_MENSAIS = {
    1:  {"nivel": "MODERADO", "motivo": "Período de filhotes de capivaras e jararacas"},
    2:  {"nivel": "MODERADO", "motivo": "Período de filhotes de capivaras e jararacas"},
    3:  {"nivel": "BAIXO",    "motivo": "Fim do período reprodutivo de capivaras"},
    4:  {"nivel": "BAIXO",    "motivo": "Período de baixa reprodução"},
    5:  {"nivel": "BAIXO",    "motivo": "Período de baixa reprodução"},
    6:  {"nivel": "BAIXO",    "motivo": "Início do período de tatus"},
    7:  {"nivel": "MODERADO", "motivo": "Período reprodutivo de gambás e tatus"},
    8:  {"nivel": "ALTO",     "motivo": "Início da nidificação de aves e gambás"},
    9:  {"nivel": "ALTO",     "motivo": "Pico de nidificação — sabiá, tesourinha, gambá"},
    10: {"nivel": "CRITICO",  "motivo": "Pico reprodutivo — jararaca, sabiá, tesourinha, gambá"},
    11: {"nivel": "CRITICO",  "motivo": "Filhotes ativos — múltiplas espécies em risco"},
    12: {"nivel": "ALTO",     "motivo": "Sabiá ainda em período reprodutivo. Jararacas ativas."},
}

def get_status_atual():
    mes_atual = datetime.now().month
    restricao = RESTRICOES_MENSAIS[mes_atual]
    especies_em_risco = [
        e for e in ESPECIES
        if mes_atual in e["periodo_reproducao"]
    ]
    return {
        "mes_atual": mes_atual,
        "restricao": restricao,
        "especies_em_risco": especies_em_risco,
        "total_especies_monitoradas": len(ESPECIES)
    }

def get_todas_especies():
    return ESPECIES

def get_calendario():
    return [
        {"mes": mes, **dados}
        for mes, dados in RESTRICOES_MENSAIS.items()
    ]

def get_alerta_os(mes=None):
    if mes is None:
        mes = datetime.now().month
    restricao = RESTRICOES_MENSAIS[mes]
    especies = [e for e in ESPECIES if mes in e["periodo_reproducao"]]
    if restricao["nivel"] in ["CRITICO", "ALTO"]:
        return {
            "alerta": True,
            "nivel": restricao["nivel"],
            "motivo": restricao["motivo"],
            "especies_afetadas": [e["nome"] for e in especies],
            "recomendacoes": [e["recomendacao"] for e in especies]
        }
    return {
        "alerta": False,
        "nivel": restricao["nivel"],
        "motivo": restricao["motivo"]
    }
import pandas as pd
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

FILE_13 = os.path.join(DATA_DIR, 'RA-RET-ROÇ-LIMP-2026-03-13.xlsx')
FILE_20 = os.path.join(DATA_DIR, 'RA-RET-ROÇ-LIMP-2026-03-20.xlsx')

AREAS = {
    '1.1': 'Canteiro Dispositivo Ext.',
    '1.2': 'Canteiro Marginal Externa',
    '1.4': 'Canteiro Lateral Externa',
    '1.6': 'Canteiro Central Externa',
    '1.7': 'Canteiro Central Interna',
    '1.9': 'Canteiro Lateral Interna',
    '1.11': 'Canteiro Marginal Interna',
    '1.12': 'Canteiro Dispositivo Int.',
}

def parse_xlsx(filepath):
    df = pd.read_excel(filepath, header=None)
    kms = list(df.iloc[8, 5:].values)
    trechos = []
    for _, row in df.iterrows():
        item = str(row.iloc[0]).strip()
        if item in AREAS:
            valores = list(row.iloc[5:].values)
            for i, km in enumerate(kms):
                try:
                    km_val = float(km)
                    nivel = valores[i]
                    if nivel in [1, 2, 3]:
                        trechos.append({
                            'item': item,
                            'area': AREAS[item],
                            'km': km_val,
                            'nivel': int(nivel)
                        })
                except:
                    continue
    return trechos

def calcular_crescimento():
    dados_13 = parse_xlsx(FILE_13)
    dados_20 = parse_xlsx(FILE_20)

    df_13 = pd.DataFrame(dados_13)
    df_20 = pd.DataFrame(dados_20)

    merged = pd.merge(
        df_13, df_20,
        on=['item', 'km'],
        suffixes=('_13', '_20')
    )

    merged['crescimento'] = merged['nivel_20'] - merged['nivel_13']
    merged['critico'] = (merged['nivel_20'] == 3) | (merged['crescimento'] > 0)

    resultado = merged[[
        'km', 'item', 'area_13', 'nivel_13', 'nivel_20', 'crescimento', 'critico'
    ]].rename(columns={'area_13': 'area'})

    return resultado.to_dict(orient='records')

def get_resumo():
    dados = calcular_crescimento()
    df = pd.DataFrame(dados)
    return {
        'total_trechos': len(df),
        'criticos': int(df['critico'].sum()),
        'nivel_medio': round(df['nivel_20'].mean(), 2),
        'com_crescimento': int((df['crescimento'] > 0).sum())
    }

def gerar_ordem_servico():
    criticos = [t for t in calcular_crescimento() if t['critico']]
    
    ordens = []
    for t in criticos:
        nivel = t['nivel_20']
        crescimento = t['crescimento']
        
        if nivel == 3 or crescimento >= 2:
            prioridade = 'URGENTE'
            prazo = '48 horas'
            metodo = 'Roçada mecanizada'
            equipes = 3
            epi = 'Capacete, colete refletivo, protetor auricular, óculos, luvas, botina'
        elif nivel == 2 or crescimento == 1:
            prioridade = 'ALTA'
            prazo = '7 dias'
            metodo = 'Roçada manual ou mecanizada'
            equipes = 2
            epi = 'Colete refletivo, luvas, botina, óculos'
        else:
            prioridade = 'MEDIA'
            prazo = '15 dias'
            metodo = 'Roçada manual'
            equipes = 1
            epi = 'Colete refletivo, luvas, botina'

        ordens.append({
            'km': t['km'],
            'area': t['area'],
            'nivel_atual': nivel,
            'crescimento': crescimento,
            'prioridade': prioridade,
            'prazo': prazo,
            'metodo': metodo,
            'equipes_necessarias': equipes,
            'epi': epi,
            'observacao': f"Trecho KM {int(t['km']/1000)}+{int(t['km']%1000):03d} — {t['area']}"
        })

    ordens.sort(key=lambda x: (
        0 if x['prioridade'] == 'URGENTE' else
        1 if x['prioridade'] == 'ALTA' else 2
    ))

    return ordens
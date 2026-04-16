import httpx

LATITUDE = -23.5505
LONGITUDE = -46.6333
RAIO_KM = 15

ESPECIES_INTERESSE = [
    "Didelphis albiventris",
    "Hydrochoerus hydrochaeris",
    "Dasypus novemcinctus",
    "Bothrops jararaca",
    "Turdus rufiventris",
    "Tyrannus savana",
]

async def buscar_ocorrencias_gbif():
    url = "https://api.gbif.org/v1/occurrence/search"
    resultados = []

    async with httpx.AsyncClient(timeout=10) as client:
        for especie in ESPECIES_INTERESSE:
            try:
                params = {
                    "decimalLatitude": f"{LATITUDE - 0.15},{LATITUDE + 0.15}",
                    "decimalLongitude": f"{LONGITUDE - 0.15},{LONGITUDE + 0.15}",
                    "scientificName": especie,
                    "limit": 5,
                    "hasCoordinate": True,
                }
                resp = await client.get(url, params=params)
                data = resp.json()
                ocorrencias = data.get("results", [])

                for o in ocorrencias:
                    resultados.append({
                        "especie": o.get("scientificName", especie),
                        "nome_comum": o.get("vernacularName", "—"),
                        "latitude": o.get("decimalLatitude"),
                        "longitude": o.get("decimalLongitude"),
                        "data": o.get("eventDate", "Não informado"),
                        "local": o.get("locality", "Região do Rodoanel"),
                        "fonte": "GBIF — Global Biodiversity Information Facility",
                        "link": f"https://www.gbif.org/occurrence/{o.get('key')}"
                    })
            except Exception as e:
                continue

    return {
        "total": len(resultados),
        "area_monitorada": "Raio de 15km — Rodoanel Mário Covas, SP",
        "fonte": "GBIF API — gbif.org",
        "ocorrencias": resultados
    }
import xml.etree.ElementTree as ET
import os

def parse_coordinates(coord_string):
    coords = []
    pairs = coord_string.strip().split()
    for pair in pairs:
        parts = pair.split(',')
        if len(parts) >= 2:
            try:
                lng = float(parts[0])
                lat = float(parts[1])
                coords.append([lat, lng])
            except:
                continue
    return coords

def get_center(coords):
    if not coords:
        return None
    lat = sum(c[0] for c in coords) / len(coords)
    lng = sum(c[1] for c in coords) / len(coords)
    return [lat, lng]

def parse_kml(filepath):
    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        placemarks = []

        for pm in root.iter('{http://www.opengis.net/kml/2.2}Placemark'):
            name_el = pm.find('{http://www.opengis.net/kml/2.2}n')
            name = name_el.text if name_el is not None else 'Sem nome'

            coords_el = pm.find('.//{http://www.opengis.net/kml/2.2}coordinates')
            if coords_el is None:
                continue
            coords = parse_coordinates(coords_el.text)
            if not coords:
                continue

            center = get_center(coords)

            style_el = pm.find('.//{http://www.opengis.net/kml/2.2}LineStyle')
            color_hex = 'ff0000ff'
            if style_el is not None:
                color_el = style_el.find('{http://www.opengis.net/kml/2.2}color')
                if color_el is not None:
                    color_hex = color_el.text or color_hex

            placemarks.append({
                'name': name,
                'coordinates': coords,
                'center': center,
                'color_kml': color_hex,
            })

        return placemarks
    except Exception as e:
        print(f'Erro: {e}')
        return []

def kml_color_to_hex(kml_color):
    try:
        r = kml_color[6:8]
        g = kml_color[4:6]
        b = kml_color[2:4]
        return f'#{r}{g}{b}'
    except:
        return '#888888'

def get_trechos_mapa():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(base, 'data', 'classificacao_rocada.kmz')
    trechos = parse_kml(path)
    result = []
    for t in trechos:
        color = kml_color_to_hex(t['color_kml'])
        if t['center']:
            result.append({
                'name': t['name'],
                'center': t['center'],
                'coordinates': t['coordinates'],
                'color': color,
            })
    return result

def get_marcos_km():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(base, 'data', 'classificacao_rocada.kmz')
    trechos = parse_kml(path)
    result = []
    seen = set()
    for t in trechos:
        if t['center']:
            key = f"{t['center'][0]:.3f},{t['center'][1]:.3f}"
            if key not in seen:
                seen.add(key)
                result.append({
                    'name': t['name'],
                    'lat': t['center'][0],
                    'lng': t['center'][1],
                })
    return result[:50]

def get_pontos_criticos_mapa():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(base, 'data', 'classificacao_rocada.kmz')
    trechos = parse_kml(path)
    pontos = []
    for i, t in enumerate(trechos):
        if t['center']:
            pontos.append({
                'id': i,
                'lat': t['center'][0],
                'lng': t['center'][1],
                'name': t['name'],
                'color': kml_color_to_hex(t['color_kml']),
            })
    return pontos
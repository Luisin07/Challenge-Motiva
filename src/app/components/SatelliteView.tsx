import { useState } from 'react';
import { SatelliteImage, NDVIData } from '../types/rodoanel';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Layers, Calendar, Cloud } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SatelliteViewProps {
  image: SatelliteImage;
  ndvi: NDVIData;
  segmentName: string;
}

export function SatelliteView({ image, ndvi, segmentName }: SatelliteViewProps) {
  const [showNDVI, setShowNDVI] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Imagem de Satélite</h3>
          <p className="text-sm text-slate-600">{segmentName}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="ndvi-layer"
              checked={showNDVI}
              onCheckedChange={setShowNDVI}
            />
            <Label htmlFor="ndvi-layer" className="text-sm cursor-pointer">
              NDVI Overlay
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
            <Label htmlFor="labels" className="text-sm cursor-pointer">
              Rótulos
            </Label>
          </div>
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-200">
        {/* Satellite Image */}
        <ImageWithFallback
          src={image.url}
          alt={`Satellite image of ${segmentName}`}
          className="w-full h-[400px] object-cover"
        />

        {/* NDVI Overlay */}
        {showNDVI && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-yellow-500/20 to-red-500/10 mix-blend-multiply" />
        )}

        {/* Labels */}
        {showLabels && (
          <div className="absolute top-4 left-4 space-y-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-900">
                  {new Date(image.captureDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-sm">
                <Layers className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700">{image.source}</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-sm">
                <Cloud className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700">Nuvens: {image.cloudCoverage}%</span>
              </div>
            </div>
          </div>
        )}

        {/* NDVI Color Scale */}
        {showNDVI && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
            <div className="text-xs font-medium text-slate-700 mb-2">NDVI</div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-4 rounded bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
              <div className="flex flex-col text-xs text-slate-600">
                <span>1.0</span>
                <span className="mt-[-8px]">-1.0</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image metadata */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-600 mb-1">Resolução</div>
          <div className="font-semibold text-slate-900">{image.resolution}m/pixel</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-600 mb-1">NDVI Médio</div>
          <div className="font-semibold text-slate-900">{ndvi.value.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-600 mb-1">Cobertura</div>
          <div className="font-semibold text-slate-900">{ndvi.coverage}%</div>
        </div>
      </div>
    </div>
  );
}

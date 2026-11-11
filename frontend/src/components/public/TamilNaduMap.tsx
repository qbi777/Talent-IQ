import React, { useState } from 'react';
import { DistrictName, College } from '../../types';
import { MapPin, Building2, Users, Award, ExternalLink, Compass } from 'lucide-react';

interface DistrictGeoData {
  id: DistrictName;
  name: string;
  x: number; // Percentage X
  y: number; // Percentage Y
  description: string;
  region: 'North' | 'West' | 'Central' | 'South';
}

const TN_DISTRICTS: DistrictGeoData[] = [
  { id: 'Chennai', name: 'Chennai', x: 80, y: 15, description: 'Capital city & premier research hub (CEG Anna University, IITM, SSN, MIT)', region: 'North' },
  { id: 'Chengalpattu', name: 'Chengalpattu', x: 78, y: 22, description: 'OMR IT Corridor & tech campus cluster', region: 'North' },
  { id: 'Vellore', name: 'Vellore', x: 62, y: 18, description: 'Renowned technology & biomedical institutions (VIT, CMC)', region: 'North' },
  { id: 'Salem', name: 'Salem', x: 48, y: 35, description: 'Steel & metallurgy engineering center (GCE Salem, Sona)', region: 'West' },
  { id: 'Erode', name: 'Erode', x: 38, y: 44, description: 'Textile & engineering cluster (Kongu, Bannari Amman)', region: 'West' },
  { id: 'Coimbatore', name: 'Coimbatore', x: 26, y: 52, description: 'Top autonomous institutions (PSG Tech, CIT, KCT)', region: 'West' },
  { id: 'Tiruchirappalli', name: 'Tiruchirappalli', x: 58, y: 53, description: 'Central education hub (NIT Trichy, Saranathan, St. Joseph)', region: 'Central' },
  { id: 'Thanjavur', name: 'Thanjavur', x: 70, y: 56, description: 'Cultural capital & research universities (SASTRA)', region: 'Central' },
  { id: 'Dindigul', name: 'Dindigul', x: 42, y: 64, description: 'Central gateway & agricultural technology institutions', region: 'Central' },
  { id: 'Madurai', name: 'Madurai', x: 46, y: 73, description: 'Temple city & historical higher education (TCE Madurai, MKU)', region: 'South' },
  { id: 'Tirunelveli', name: 'Tirunelveli', x: 38, y: 86, description: 'Southern engineering zone (GCE Tirunelveli, FXEC)', region: 'South' },
  { id: 'Thoothukudi', name: 'Thoothukudi', x: 49, y: 87, description: 'Coastal research centers (VOC College, NEC)', region: 'South' },
  { id: 'Kanyakumari', name: 'Kanyakumari', x: 34, y: 94, description: 'Southern tip; marine & aeronautical engineering (NICHE)', region: 'South' }
];

interface TamilNaduMapProps {
  colleges: College[];
  selectedDistrict: DistrictName | 'All';
  onSelectDistrict: (district: DistrictName | 'All') => void;
  onSelectCollege?: (college: College) => void;
}

export const TamilNaduMap: React.FC<TamilNaduMapProps> = ({
  colleges,
  selectedDistrict,
  onSelectDistrict,
  onSelectCollege
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeoData | null>(null);

  // Group colleges by district
  const districtCollegeMap: Record<string, College[]> = {};
  colleges.forEach(c => {
    districtCollegeMap[c.district] = districtCollegeMap[c.district] || [];
    districtCollegeMap[c.district].push(c);
  });

  return (
    <div className="apple-card p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-black/[0.05] gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#0071e3]" />
            <h3 className="text-base font-bold text-[#1d1d1f] tracking-tight">
              Tamil Nadu Institutional Map
            </h3>
          </div>
          <p className="text-xs text-[#86868b]">
            Apple Maps inspired geospatial view of participating assessment centers
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedDistrict !== 'All' && (
            <button
              onClick={() => onSelectDistrict('All')}
              className="text-xs text-[#0071e3] hover:text-[#0077ED] font-medium px-3 py-1.5 rounded-full bg-[#0071e3]/10 transition-colors"
            >
              Reset District Filter
            </button>
          )}
          <span className="text-xs font-mono font-medium text-[#1d1d1f] bg-black/[0.04] px-3 py-1 rounded-full">
            {colleges.length} Institutions Mapped
          </span>
        </div>
      </div>

      {/* Map Interactive Canvas (Apple Maps Aesthetic) */}
      <div className="relative mt-5 w-full h-[470px] bg-gradient-to-b from-[#edf2f7]/80 via-[#f7fafc] to-[#eef2f6] rounded-[24px] border border-black/[0.06] overflow-hidden flex items-center justify-center p-4 shadow-inner">
        {/* Apple Maps Grid */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(0, 113, 227, 0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Coastal Waters Subtle Labels */}
        <div className="absolute right-6 bottom-10 text-[11px] text-[#0071e3]/40 font-mono tracking-widest uppercase select-none pointer-events-none">
          Bay of Bengal
        </div>
        <div className="absolute left-6 bottom-6 text-[11px] text-[#0071e3]/40 font-mono tracking-widest uppercase select-none pointer-events-none">
          Indian Ocean
        </div>

        {/* Tamil Nadu Stylized Contour SVG */}
        <svg 
          viewBox="0 0 500 560" 
          className="w-full h-full max-h-[440px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] select-none"
        >
          {/* Tamil Nadu Outline Silhouette */}
          <path
            d="M 280 40 
               L 410 70 
               L 420 120 
               L 400 170 
               L 410 240 
               L 370 290 
               L 390 340 
               L 360 400 
               L 310 460 
               L 260 510 
               L 220 535 
               L 210 515 
               L 180 470 
               L 190 410 
               L 160 360 
               L 130 310 
               L 140 270 
               L 180 230 
               L 220 180 
               L 250 110 
               Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="2"
            className="transition-colors duration-300"
          />

          {/* Regional Network Connectors */}
          <line x1="400" y1="90" x2="160" y2="290" stroke="#0071e3" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />
          <line x1="400" y1="90" x2="300" y2="295" stroke="#0071e3" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />
          <line x1="160" y1="290" x2="250" y2="400" stroke="#0071e3" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />
          <line x1="300" y1="295" x2="250" y2="400" stroke="#0071e3" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />
          <line x1="250" y1="400" x2="220" y2="520" stroke="#0071e3" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />

          {/* District Pins */}
          {TN_DISTRICTS.map((district) => {
            const districtColleges = districtCollegeMap[district.id] || [];
            const hasColleges = districtColleges.length > 0;
            const isSelected = selectedDistrict === district.id;
            const isHovered = hoveredDistrict?.id === district.id;

            const cx = (district.x / 100) * 460 + 20;
            const cy = (district.y / 100) * 510 + 25;

            return (
              <g 
                key={district.id}
                className="cursor-pointer group"
                onClick={() => onSelectDistrict(district.id)}
                onMouseEnter={() => setHoveredDistrict(district)}
                onMouseLeave={() => setHoveredDistrict(null)}
              >
                {/* Apple Pulse Ring */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={hasColleges ? 22 : 16}
                    fill="none"
                    stroke="#0071e3"
                    strokeWidth="2"
                    className="animate-ping opacity-50"
                  />
                )}

                {/* Outer Pin Body */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={hasColleges ? 15 : 9}
                  fill={isSelected ? '#0071e3' : hasColleges ? '#34c759' : '#94a3b8'}
                  className="transition-all duration-200"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,113,227,0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
                  }}
                />

                {/* Inner White Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={hasColleges ? 11 : 5}
                  fill="#ffffff"
                />

                {/* Number of institutions inside the pin */}
                {hasColleges && (
                  <text
                    x={cx}
                    y={cy + 3.5}
                    textAnchor="middle"
                    fill={isSelected ? '#0071e3' : '#1d1d1f'}
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="-apple-system, sans-serif"
                  >
                    {districtColleges.length}
                  </text>
                )}

                {/* Label */}
                <text
                  x={cx + (district.x > 50 ? -14 : 14)}
                  y={cy + (district.y > 80 ? -12 : 4)}
                  textAnchor={district.x > 50 ? 'end' : 'start'}
                  fill={isSelected ? '#0071e3' : isHovered ? '#1d1d1f' : '#475569'}
                  fontSize={isSelected || isHovered ? '11.5' : '10'}
                  fontWeight={isSelected || isHovered ? '700' : '500'}
                  className="transition-all duration-200 select-none drop-shadow-sm"
                >
                  {district.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Apple Maps Hover Popover */}
        {hoveredDistrict && (
          <div className="absolute top-4 left-4 z-20 apple-glass rounded-[20px] p-4 shadow-xl max-w-xs text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
              <span className="font-bold text-[#1d1d1f] text-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
                {hoveredDistrict.name} District
              </span>
              <span className="text-[10px] font-semibold bg-black/[0.05] text-[#86868b] px-2 py-0.5 rounded-full">
                {hoveredDistrict.region} Zone
              </span>
            </div>
            <p className="text-[#515154] mt-2 text-[11px] leading-relaxed">
              {hoveredDistrict.description}
            </p>
            <div className="mt-3 pt-2 border-t border-black/[0.05] flex items-center justify-between text-[11px]">
              <span className="text-[#86868b]">Participating Institutions:</span>
              <span className="font-bold text-[#0071e3] font-mono">
                {(districtCollegeMap[hoveredDistrict.id] || []).length} colleges
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Apple Style Segmented District Pills */}
      <div className="mt-5 pt-4 border-t border-black/[0.05]">
        <div className="text-xs font-semibold text-[#86868b] mb-2.5">Filter by District:</div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectDistrict('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedDistrict === 'All'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'bg-black/[0.04] text-[#515154] hover:bg-black/[0.08]'
            }`}
          >
            All Districts ({colleges.length})
          </button>
          {TN_DISTRICTS.map((d) => {
            const count = (districtCollegeMap[d.id] || []).length;
            const isSelected = selectedDistrict === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#0071e3] text-white shadow-sm'
                    : 'bg-black/[0.04] text-[#515154] hover:bg-black/[0.08]'
                }`}
              >
                <span>{d.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/[0.08] text-[#1d1d1f]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

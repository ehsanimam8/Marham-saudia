import React from 'react';
import { cn } from '@/lib/utils'; // Assuming standard utils from shadcn setup or similar

interface BodyMapSVGProps {
    onZoneClick: (zoneId: string) => void;
    hoveredZone: string | null;
    selectedZone: string | null;
    className?: string;
}

export default function BodyMapSVG({
    onZoneClick,
    hoveredZone,
    selectedZone,
    className
}: BodyMapSVGProps) {

    const getZoneClass = (zoneId: string) => cn(
        "cursor-pointer transition-all duration-300 fill-teal-50/50 stroke-teal-200 stroke-2 hover:fill-teal-100/50 hover:stroke-teal-500 hover:filter hover:drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]",
        selectedZone === zoneId && "fill-teal-200/50 stroke-teal-600 filter drop-shadow-[0_0_15px_rgba(20,184,166,0.7)] animate-pulse",
        hoveredZone === zoneId && "fill-teal-100 stroke-teal-400"
    );

    const SideLabel = ({ zoneId }: { zoneId: string | null }) => {
        if (!zoneId) return null;

        const labels: { [key: string]: { x: number, y: number, text: string, align: 'start' | 'end' | 'middle' } } = {
            'hair': { x: 380, y: 50, text: 'Hair / الشعر', align: 'end' },
            'face': { x: 380, y: 90, text: 'Face / الوجه', align: 'end' },
            'nose': { x: 380, y: 120, text: 'Nose / الأنف', align: 'end' },
            'neck': { x: 380, y: 150, text: 'Neck / الرقبة', align: 'end' },
            'shoulders': { x: 380, y: 180, text: 'Shoulders / الأكتاف', align: 'end' },
            'chest': { x: 380, y: 230, text: 'Chest / الصدر', align: 'end' },
            'abdomen': { x: 380, y: 300, text: 'Abdomen / البطن', align: 'end' },
            'reproductive': { x: 380, y: 360, text: 'Repro / التناسلي', align: 'end' },
            'hips': { x: 380, y: 400, text: 'Hips / الوركين', align: 'end' },
            'thighs': { x: 380, y: 500, text: 'Thighs / الفخذين', align: 'end' },
            'legs': { x: 380, y: 640, text: 'Legs / الساقين', align: 'end' },
            'feet': { x: 380, y: 760, text: 'Feet / القدمين', align: 'end' },
        };

        const label = labels[zoneId];
        if (!label) return null;

        return (
            <text
                x={label.x}
                y={label.y}
                className="text-2xl fill-teal-800 font-bold drop-shadow-md tracking-wide"
                textAnchor={label.align}
                style={{ fontWeight: 800 }}
            >
                {label.text}
            </text>
        );
    };

    return (
        <div className={cn("relative w-full h-full max-w-[500px] mx-auto", className)}>
            <svg
                viewBox="0 0 400 800"
                className="w-full h-full drop-shadow-xl"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.05))' }}
            >
                <defs>
                    <clipPath id="bodyClip">
                        <rect x="0" y="0" width="400" height="800" rx="20" />
                    </clipPath>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background Image - Final Selected Version */}
                <image
                    href="/body-silhouette-final.png"
                    x="0"
                    y="0"
                    width="400"
                    height="800"
                    preserveAspectRatio="xMidYMid slice"
                    opacity="0.95"
                />

                {/* --- INTERACTIVE ZONES (Transparent Hitboxes) --- */}

                <g id="hair-zone" className={`group ${getZoneClass('hair')}`} onClick={() => onZoneClick('hair')}>
                    {/* Wider hair area */}
                    <path d="M140,80 C140,20 180,5 200,5 C220,5 260,20 260,80 C260,110 250,130 250,130 L150,130 C150,130 140,110 140,80 Z" fill="transparent" stroke="transparent" />
                </g>

                <g id="face-zone" className={`group ${getZoneClass('face')}`} onClick={() => onZoneClick('face')}>
                    {/* Check image face position - typically centered around 200,80 */}
                    <ellipse cx="200" cy="85" rx="38" ry="48" fill="transparent" stroke="transparent" />
                </g>

                <g id="nose-zone" className={`group ${getZoneClass('nose')}`} onClick={() => onZoneClick('nose')}>
                    <circle cx="200" cy="90" r="12" fill="transparent" stroke="transparent" />
                </g>

                <g id="neck-zone" className={`group ${getZoneClass('neck')}`} onClick={() => onZoneClick('neck')}>
                    <rect x="175" y="135" width="50" height="35" fill="transparent" stroke="transparent" />
                </g>

                <g id="shoulders-zone" className={`group ${getZoneClass('shoulders')}`} onClick={() => onZoneClick('shoulders')}>
                    {/* Shoulders roughly 160-190 Y */}
                    <path d="M120,160 Q200,150 280,160 L290,195 L110,195 Z" fill="transparent" stroke="transparent" />
                </g>

                <g id="chest-zone" className={`group ${getZoneClass('chest')}`} onClick={() => onZoneClick('chest')}>
                    {/* Chest roughly 200-260 Y */}
                    <path d="M130,200 L270,200 L260,260 Q200,270 140,260 Z" fill="transparent" stroke="transparent" />
                </g>

                <g id="abdomen-zone" className={`group ${getZoneClass('abdomen')}`} onClick={() => onZoneClick('abdomen')}>
                    {/* Waist/Abdomen roughly 260-340 Y */}
                    <path d="M145,260 Q200,270 255,260 L250,340 Q200,350 150,340 Z" fill="transparent" stroke="transparent" />
                </g>

                <g id="reproductive-zone" className={`group ${getZoneClass('reproductive')}`} onClick={() => onZoneClick('reproductive')}>
                    {/* Lower abdomen/pelvis roughly 340-380 Y */}
                    <path d="M150,340 Q200,350 250,340 L240,380 L160,380 Z" fill="transparent" stroke="transparent" />
                </g>

                <g id="hips-zone" className={`group ${getZoneClass('hips')}`} onClick={() => onZoneClick('hips')}>
                    {/* Hips are wider, 340-420 Y */}
                    <path d="M110,340 Q100,400 145,420 L145,340 Z" fill="transparent" stroke="transparent" />
                    <path d="M290,340 Q300,400 255,420 L255,340 Z" fill="transparent" stroke="transparent" />
                </g>

                <g id="thighs-zone" className={`group ${getZoneClass('thighs')}`} onClick={() => onZoneClick('thighs')}>
                    {/* Thighs 420-550 Y */}
                    <path d="M150,420 L195,420 L190,560 L155,560 Z" fill="transparent" stroke="transparent" />
                    <path d="M205,420 L250,420 L245,560 L210,560 Z" fill="transparent" stroke="transparent" />
                </g>

                <g id="legs-zone" className={`group ${getZoneClass('legs')}`} onClick={() => onZoneClick('legs')}>
                    {/* Sine/Calves 580-720 Y */}
                    <path d="M160,580 L195,580 L190,720 L165,720 Z" fill="transparent" stroke="transparent" />
                    <path d="M205,580 L240,580 L235,720 L210,720 Z" fill="transparent" stroke="transparent" />
                </g>

                <g id="feet-zone" className={`group ${getZoneClass('feet')}`} onClick={() => onZoneClick('feet')}>
                    {/* Feet 740+ */}
                    <path d="M155,740 L195,740 L200,780 L150,780 Z" fill="transparent" stroke="transparent" />
                    <path d="M205,740 L245,740 L250,780 L200,780 Z" fill="transparent" stroke="transparent" />
                </g>

                {/* --- DYNAMIC SIDE LABELS --- */}
                {(hoveredZone || selectedZone) && (
                    <g className="pointer-events-none transition-all duration-300 ease-out">
                        <SideLabel zoneId={hoveredZone || selectedZone} />
                    </g>
                )}

            </svg>
        </div>
    );
}

"use client";

import { useState } from 'react';
import BodyMapSVG from './BodyMapSVG';
import { BODY_ZONES } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Stethoscope, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BodyNavigator() {
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'aesthetics' | 'wellness' | 'health'>('aesthetics');

    const selectedZone = selectedZoneId ? BODY_ZONES[selectedZoneId as keyof typeof BODY_ZONES] : null;

    return (
        <div className="flex flex-col lg:flex-row h-[80vh] w-full max-w-7xl mx-auto gap-6 p-4 relative">

            {/* Sidebar / Top Bar for Navigation (Tabs) */}
            <div className="w-full lg:w-64 flex flex-col gap-4 z-10">
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex lg:flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('aesthetics')}
                        className={`flex-1 flex items-center gap-2 p-3 rounded-xl transition-all ${activeTab === 'aesthetics' ? 'bg-purple-50 text-purple-600 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'aesthetics' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">تجميل</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('wellness')}
                        className={`flex-1 flex items-center gap-2 p-3 rounded-xl transition-all ${activeTab === 'wellness' ? 'bg-green-50 text-green-600 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'wellness' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Activity className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">صحة نفسية</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('health')}
                        className={`flex-1 flex items-center gap-2 p-3 rounded-xl transition-all ${activeTab === 'health' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'health' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <Stethoscope className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">صحة عامة</span>
                    </button>
                </div>

                <div className="hidden lg:block bg-gradient-to-br from-teal-50 to-white rounded-2xl p-6 border border-teal-100/50">
                    <h3 className="font-bold text-teal-800 mb-2">كيف نساعدك؟</h3>
                    <p className="text-sm text-teal-600/80 mb-4">
                        اضغطي على أي منطقة في الجسم لاستكشاف الأعراض أو العلاجات المتاحة.
                    </p>
                    <div className="text-xs text-teal-500 bg-white/50 p-3 rounded-lg">
                        💡 جربي الضغط على "البطن" لاستكشاف خيارات التخسيس أو علاج القولون.
                    </div>
                </div>
            </div>

            {/* Main Interactive Area */}
            <div className="flex-1 relative flex items-center justify-center bg-white rounded-3xl overflow-hidden min-h-[500px]">
                <div className="absolute top-4 right-4 z-10">
                    {activeTab === 'health' && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">نمط الصحة العامة</span>}
                    {activeTab === 'aesthetics' && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">نمط التجميل</span>}
                    {activeTab === 'wellness' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">نمط الصحة النفسية</span>}
                </div>

                <BodyMapSVG
                    onZoneClick={setSelectedZoneId}
                    selectedZone={selectedZoneId}
                    hoveredZone={hoveredZoneId}
                />

                {/* Floating Helper Label for Hover (Desktop) */}
                {/* Simplified: The SVG has labels inside it now */}
            </div>

            {/* Details Drawer / Panel */}
            <AnimatePresence>
                {selectedZone && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 left-0 w-full md:w-[450px] bg-white shadow-2xl z-50 border-r border-gray-100 flex flex-col"
                    >
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                            <div>
                                <div className="flex items-center gap-2 text-2xl mb-1">
                                    <span>{selectedZone.icon}</span>
                                    <h2 className="font-bold text-gray-900">{selectedZone.nameAr}</h2>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">{selectedZone.nameEn}</p>
                            </div>
                            <button
                                onClick={() => setSelectedZoneId(null)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">

                            {/* Health Concerns Section */}
                            {(activeTab === 'health' || activeTab === 'wellness') && (
                                <div className="mb-8">
                                    <h3 className="flex items-center gap-2 font-bold text-blue-700 mb-4 text-lg">
                                        <Stethoscope className="w-5 h-5" />
                                        مشاكل صحية شائعة
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedZone.categories?.health?.length > 0 ? selectedZone.categories.health.map((item, idx) => (
                                            <div key={idx} className="group p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30 transition-all cursor-pointer flex justify-between items-center">
                                                <span className="font-medium text-gray-700 group-hover:text-blue-700">{item}</span>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                                            </div>
                                        )) : (
                                            <p className="text-sm text-gray-400 italic">لا توجد مشاكل صحية شائعة مسجلة لهذه المنطقة.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Aesthetic Procedures Section */}
                            {(activeTab === 'aesthetics') && (
                                <div className="mb-8">
                                    <h3 className="flex items-center gap-2 font-bold text-purple-700 mb-4 text-lg">
                                        <Sparkles className="w-5 h-5" />
                                        إجراءات تجميلية
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedZone.categories?.aesthetics?.length > 0 ? selectedZone.categories.aesthetics.map((item, idx) => (
                                            <div key={idx} className="group p-4 rounded-xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-md hover:bg-purple-50/30 transition-all cursor-pointer flex justify-between items-center">
                                                <span className="font-medium text-gray-700 group-hover:text-purple-700">{item}</span>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500" />
                                            </div>
                                        )) : (
                                            <p className="text-sm text-gray-400 italic">لا توجد إجراءات تجميلية مسجلة لهذه المنطقة.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Specialists Section */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-3">التخصصات ذات الصلة:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedZone.specialists.map((spec, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                            {spec.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <Link href="/doctors">
                                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 text-lg shadow-lg shadow-teal-600/20">
                                    حجز استشارة الآن
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for mobile when drawer is open */}
            {selectedZone && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSelectedZoneId(null)}
                />
            )}
        </div>
    );
}

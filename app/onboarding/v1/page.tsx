"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Activity, ArrowRight, Check, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Data ---

type Step = 'welcome' | 'category' | 'grid' | 'refine' | 'reveal';

const CATEGORIES = [
    { id: 'body', label: 'Body Goals', icon: '💪', desc: 'Fitness, Weight, Toning' },
    { id: 'beauty', label: 'Beauty & Skin', icon: '✨', desc: 'Skincare, Aesthetics, Glow' },
    { id: 'wellness', label: 'Mental Wellness', icon: '🧠', desc: 'Stress, Sleep, Balance' },
    { id: 'fertility', label: 'Fertility', icon: '👶', desc: 'Planning, Health, Cycle' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🥗', desc: 'Nutrition, Habits, Detox' },
    { id: 'medical', label: 'Medical Care', icon: '👩‍⚕️', desc: 'Checkups, Prevention' },
];

const IMAGES_BODY = [
    { id: 1, text: 'Yoga Flow', color: 'bg-teal-100', type: 'wellness' },
    { id: 2, text: 'Meal Prep', color: 'bg-green-100', type: 'nutrition' },
    { id: 3, text: 'Running', color: 'bg-orange-100', type: 'active' },
    { id: 4, text: 'Gym Time', color: 'bg-blue-100', type: 'strength' },
    { id: 5, text: 'Meditation', color: 'bg-purple-100', type: 'mind' },
    { id: 6, text: 'Scale Goal', color: 'bg-red-100', type: 'goal' },
    { id: 7, text: 'Home Workout', color: 'bg-yellow-100', type: 'convenience' },
    { id: 8, text: 'Green Smoothie', color: 'bg-emerald-100', type: 'detox' },
    { id: 9, text: 'Pilates', color: 'bg-pink-100', type: 'low-impact' },
    { id: 10, text: 'Tracking App', color: 'bg-indigo-100', type: 'data' },
    { id: 11, text: 'Group Class', color: 'bg-rose-100', type: 'social' },
    { id: 12, text: 'Sleep', color: 'bg-slate-100', type: 'recovery' },
];

export default function OnboardingV1() {
    const [step, setStep] = useState<Step>('welcome');
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<number[]>([]);

    const toggleCat = (id: string) => {
        if (selectedCats.includes(id)) {
            setSelectedCats(selectedCats.filter(c => c !== id));
        } else {
            if (selectedCats.length < 3) setSelectedCats([...selectedCats, id]);
        }
    };

    const toggleImage = (id: number) => {
        if (selectedImages.includes(id)) {
            setSelectedImages(selectedImages.filter(i => i !== id));
        } else {
            setSelectedImages([...selectedImages, id]);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans overflow-hidden selection:bg-purple-100">

            {/* ProgressBar (Optional visuals) */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{
                        width: step === 'welcome' ? '10%' :
                            step === 'category' ? '30%' :
                                step === 'grid' ? '60%' :
                                    step === 'reveal' ? '100%' : '50%'
                    }}
                />
            </div>

            <AnimatePresence mode="wait">

                {/* --- SCREEN 1: WELCOME --- */}
                {step === 'welcome' && (
                    <motion.div
                        key="welcome"
                        className="h-screen flex flex-col items-center justify-center p-6 text-center relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Background elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute w-32 h-40 rounded-xl bg-gradient-to-br opacity-20 shadow-lg`}
                                    style={{
                                        top: `${Math.random() * 80}%`,
                                        left: `${Math.random() * 80}%`,
                                        background: i % 2 === 0 ? 'linear-gradient(135deg, #e9d5ff 0%, #fae8ff 100%)' : 'linear-gradient(135deg, #ccfbf1 0%, #ecfeff 100%)',
                                        rotate: Math.random() * 30 - 15
                                    }}
                                    animate={{
                                        y: [0, -20, 0],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            ))}
                        </div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="z-10 bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/50 max-w-lg"
                        >
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 tracking-tight">
                                Marham <span className="text-purple-600">Moods</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-2 font-medium">Your Health, Your Style</p>
                            <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm">
                                No boring questions. Just show us what inspires you, and we'll handle the rest.
                            </p>
                            <Button
                                onClick={() => setStep('category')}
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 py-6 text-lg font-bold shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95"
                            >
                                Start Creating <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                {/* --- SCREEN 2: CATEGORIES --- */}
                {step === 'category' && (
                    <motion.div
                        key="category"
                        className="min-h-screen flex flex-col items-center justify-center p-6 max-w-4xl mx-auto"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold mb-2">Pick 3 Areas That Matter</h2>
                            <p className="text-slate-500">What's on your mind lately? Tap to select.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-10">
                            {CATEGORIES.map((cat, idx) => (
                                <motion.button
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => toggleCat(cat.id)}
                                    className={cn(
                                        "relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group hover:shadow-md",
                                        selectedCats.includes(cat.id)
                                            ? "border-purple-600 bg-purple-50/50 shadow-inner"
                                            : "border-slate-100 bg-white hover:border-purple-200"
                                    )}
                                >
                                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                                    <h3 className="font-bold text-slate-900">{cat.label}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>

                                    {selectedCats.includes(cat.id) && (
                                        <div className="absolute top-4 right-4 bg-purple-600 text-white rounded-full p-1">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        <div className="fixed bottom-8 w-full max-w-md px-6">
                            <Button
                                disabled={selectedCats.length === 0}
                                onClick={() => setStep('grid')}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Continue ({selectedCats.length})
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* --- SCREEN 3: IMAGE GRID --- */}
                {step === 'grid' && (
                    <motion.div
                        key="grid"
                        className="min-h-screen p-4 pb-32"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 py-4 px-2 mb-6 border-b border-gray-100">
                            <div className="flex justify-between items-center max-w-4xl mx-auto">
                                <div>
                                    <h2 className="font-bold text-xl">Body Goals</h2>
                                    <p className="text-xs text-slate-500">Tap images that feel like "you"</p>
                                </div>
                                <div className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
                                    {selectedImages.length} Selected
                                </div>
                            </div>
                        </div>

                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 px-2 max-w-6xl mx-auto space-y-4">
                            {IMAGES_BODY.map((img, idx) => (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="break-inside-avoid"
                                >
                                    <button
                                        onClick={() => toggleImage(img.id)}
                                        className={cn(
                                            "w-full aspect-[3/4] rounded-2xl relative overflow-hidden group transition-all duration-300",
                                            selectedImages.includes(img.id) ? "ring-4 ring-purple-500 scale-[0.98]" : "hover:shadow-xl hover:-translate-y-1"
                                        )}
                                    >
                                        {/* Placeholder Image Visuals */}
                                        <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 text-center transition-colors", img.color)}>
                                            <span className="text-4xl mb-2 opacity-50 group-hover:scale-125 transition-transform duration-300">
                                                {['🧘‍♀️', '🥗', '🏃‍♀️', '💪', '🧠', '⚖️', '🏠', '🥤'][idx % 8]}
                                            </span>
                                            <span className={cn("font-bold text-slate-700 opacity-60", selectedImages.includes(img.id) && "opacity-100")}>
                                                {img.text}
                                            </span>
                                        </div>

                                        {/* Interaction Overlay */}
                                        <div className={cn(
                                            "absolute inset-0 bg-black/10 transition-opacity flex items-center justify-center",
                                            selectedImages.includes(img.id) ? "opacity-100 bg-purple-500/20" : "opacity-0 group-hover:opacity-100"
                                        )}>
                                            {selectedImages.includes(img.id) ? (
                                                <Heart className="w-12 h-12 text-purple-600 fill-purple-600 drop-shadow-lg" />
                                            ) : (
                                                <Heart className="w-8 h-8 text-white/80" />
                                            )}
                                        </div>
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-30"
                        >
                            <Button
                                disabled={selectedImages.length < 3}
                                onClick={() => setStep('reveal')}
                                className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-full px-12 py-6 text-lg font-bold shadow-2xl flex items-center gap-3 transition-all hover:scale-105"
                            >
                                Build My Board <LayoutGrid className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                {/* --- SCREEN 4: REVEAL --- */}
                {step === 'reveal' && (
                    <motion.div
                        key="reveal"
                        className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden"
                    >
                        {/* Dynamic Collage Background */}
                        <div className="absolute inset-0 z-0 opacity-20">
                            {selectedImages.map((imgId, i) => {
                                const img = IMAGES_BODY.find(i => i.id === imgId);
                                return (
                                    <motion.div
                                        key={imgId}
                                        className={cn("absolute w-40 h-40 rounded-full blur-3xl", img?.color)}
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                        }}
                                        animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
                                        transition={{ duration: 10, repeat: Infinity }}
                                    />
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="z-10 text-center max-w-2xl"
                        >
                            <div className="mb-8 relative inline-block">
                                <span className="absolute -inset-4 bg-purple-500/30 blur-xl rounded-full"></span>
                                <h1 className="relative text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Your Health Vibe
                                </h1>
                            </div>

                            {/* The "Board" */}
                            <div className="grid grid-cols-3 gap-2 p-2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl mb-8 rotate-1 hover:rotate-0 transition-transform duration-500">
                                {selectedImages.slice(0, 6).map((imgId) => {
                                    const img = IMAGES_BODY.find(i => i.id === imgId);
                                    return (
                                        <div key={imgId} className={cn("aspect-square rounded-lg flex items-center justify-center text-slate-800 text-xs font-bold", img?.color)}>
                                            {img?.text}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-left border border-white/10">
                                    <h3 className="text-purple-300 font-bold mb-2 uppercase tracking-wider text-xs">Analysis</h3>
                                    <p className="text-lg font-medium">You value <span className="text-white font-bold">Holistic Wellness</span> and <span className="text-white font-bold">Convenience</span>.</p>
                                    <p className="text-slate-400 text-sm mt-2">Based on your choices, you prefer natural approaches but need time-efficient solutions.</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 py-6 font-bold text-lg">
                                        See My Doctor Matches
                                    </Button>
                                    <Button variant="ghost" className="text-slate-400 hover:text-white">
                                        Share My Mood Board
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

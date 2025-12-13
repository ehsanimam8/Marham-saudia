"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Palette, Leaf, Briefcase, Feather, CheckCircle, ArrowRight, Home, Sparkles, Coffee, Music, Smartphone, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Data Constants ---
const PALETTES = [
    { id: 'neutral', label: 'Soft Neutrals', colors: ['bg-[#f5f5f0]', 'bg-[#eecfa1]', 'bg-[#fff]'], desc: 'Gentle, Natural' },
    { id: 'rich', label: 'Deep & Rich', colors: ['bg-[#4a0404]', 'bg-[#1e1b4b]', 'bg-[#ca8a04]'], desc: 'Luxury, Premium' },
    { id: 'earth', label: 'Earth Tones', colors: ['bg-[#57534e]', 'bg-[#78350f]', 'bg-[#a3e635]'], desc: 'Holistic, Organic' },
    { id: 'bold', label: 'Bold & Bright', colors: ['bg-[#0d9488]', 'bg-[#f43f5e]', 'bg-[#facc15]'], desc: 'Modern, Innovative' },
];

const MOODS = [
    { id: 'minimal', label: 'Minimal Spa', icon: <Leaf className="w-8 h-8" />, color: 'bg-emerald-50 text-emerald-700' },
    { id: 'luxury', label: 'Luxury Clinic', icon: <Sparkles className="w-8 h-8" />, color: 'bg-purple-50 text-purple-700' },
    { id: 'cozy', label: 'Cozy Home', icon: <Home className="w-8 h-8" />, color: 'bg-orange-50 text-orange-700' },
    { id: 'modern', label: 'Modern Tech', icon: <Smartphone className="w-8 h-8" />, color: 'bg-blue-50 text-blue-700' },
];

export default function OnboardingV3() {
    const [step, setStep] = useState(0); // 0: Welcome, 1: Color, 2: Mood, 3: Reveal
    const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

    const toggleMood = (id: string) => {
        if (selectedMoods.includes(id)) {
            setSelectedMoods(selectedMoods.filter(m => m !== id));
        } else {
            if (selectedMoods.length < 2) setSelectedMoods([...selectedMoods, id]);
        }
    };

    const nextStep = () => setStep(step + 1);

    return (
        <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-serif selection:bg-stone-200 overflow-hidden">

            {/* Progress Line */}
            <div className="fixed top-0 left-0 w-full h-1 bg-stone-200 z-50">
                <motion.div
                    className="h-full bg-stone-800"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 3) * 100}% ` }}
                />
            </div>

            <AnimatePresence mode="wait">

                {/* --- SCREEN 0: WELCOME --- */}
                {step === 0 && (
                    <motion.div
                        key="welcome"
                        className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-8 border border-stone-100"
                        >
                            <Feather className="w-10 h-10 text-stone-400" />
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
                            Your Health <span className="font-bold italic">Style</span>
                        </h1>
                        <p className="text-stone-500 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                            Every woman has a unique style. Let's find doctors who match your vibe, aesthetic, and values.
                        </p>

                        <Button
                            onClick={nextStep}
                            className="bg-stone-900 text-white hover:bg-stone-800 rounded-full px-10 py-6 text-lg font-light tracking-wide shadow-lg hover:shadow-xl transition-all"
                        >
                            Discover My Style
                        </Button>
                    </motion.div>
                )}

                {/* --- SCREEN 1: COLOR PALETTE --- */}
                {step === 1 && (
                    <motion.div
                        key="color"
                        className="min-h-screen flex flex-col items-center justify-center p-6"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-light mb-2">Which palette speaks to you?</h2>
                        <p className="text-stone-400 mb-10 text-sm">Select the colors that feel right.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
                            {PALETTES.map((p, i) => (
                                <motion.button
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelectedPalette(p.id)}
                                    className={cn(
                                        "bg-white p-6 rounded-xl border transition-all duration-300 flex items-center justify-between group text-left hover:border-stone-400",
                                        selectedPalette === p.id ? "border-stone-900 shadow-md ring-1 ring-stone-900 scale-[1.02]" : "border-stone-100"
                                    )}
                                >
                                    <div>
                                        <div className="flex gap-2 mb-3">
                                            {p.colors.map((c, idx) => (
                                                <div key={idx} className={cn("w-8 h-8 rounded-full shadow-sm border border-black/5", c)} />
                                            ))}
                                        </div>
                                        <h3 className="font-bold text-stone-800">{p.label}</h3>
                                        <p className="text-xs text-stone-400 mt-1">{p.desc}</p>
                                    </div>

                                    {selectedPalette === p.id && <CheckCircle className="w-6 h-6 text-stone-900" />}
                                </motion.button>
                            ))}
                        </div>

                        <Button
                            disabled={!selectedPalette}
                            onClick={nextStep}
                            className="bg-stone-900 text-white rounded-full px-12 py-6 disabled:opacity-50"
                        >
                            Continue
                        </Button>
                    </motion.div>
                )}

                {/* --- SCREEN 2: MOOD --- */}
                {step === 2 && (
                    <motion.div
                        key="mood"
                        className="min-h-screen flex flex-col items-center justify-center p-6"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-light mb-2">Choose your ideal space</h2>
                        <p className="text-stone-400 mb-10 text-sm">Select up to 2 environments.</p>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-12">
                            {MOODS.map((m, i) => (
                                <motion.button
                                    key={m.id}
                                    onClick={() => toggleMood(m.id)}
                                    className={cn(
                                        "aspect-square rounded-2xl flex flex-col items-center justify-center gap-4 transition-all border",
                                        selectedMoods.includes(m.id)
                                            ? "bg-white border-stone-900 shadow-lg scale-105"
                                            : "bg-white border-stone-100 hover:border-stone-300"
                                    )}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={cn("p-4 rounded-full", m.color)}>
                                        {m.icon}
                                    </div>
                                    <span className="font-medium text-stone-600">{m.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        <Button
                            disabled={selectedMoods.length === 0}
                            onClick={nextStep}
                            className="bg-stone-900 text-white rounded-full px-12 py-6 disabled:opacity-50"
                        >
                            Reveal My Style
                        </Button>
                    </motion.div>
                )}

                {/* --- SCREEN 3: REVEAL --- */}
                {step === 3 && (
                    <motion.div
                        key="reveal"
                        className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-stone-900 text-stone-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="max-w-md w-full bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10"
                        >
                            <div className="mb-2 text-stone-400 uppercase tracking-widest text-xs font-bold">Your Health Style</div>
                            <h1 className="text-4xl font-serif italic mb-6 text-white">The Natural Nurturer</h1>

                            <div className="flex justify-center gap-2 mb-8">
                                {/* Swatches based on selection would go here */}
                                <div className="w-12 h-12 rounded-full bg-[#f5f5f0] border-2 border-white/20" />
                                <div className="w-12 h-12 rounded-full bg-[#eecfa1] border-2 border-white/20" />
                                <div className="w-12 h-12 rounded-full bg-[#78350f] border-2 border-white/20" />
                            </div>

                            <div className="text-left space-y-4 mb-8 bg-black/20 p-6 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Leaf className="w-5 h-5 text-emerald-400 mt-1" />
                                    <div>
                                        <strong className="block text-white">Holistic Approach</strong>
                                        <p className="text-stone-400 text-sm">You prefer gentle, natural treatments combined with medical expertise.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                                    <div>
                                        <strong className="block text-white">Calm Environments</strong>
                                        <p className="text-stone-400 text-sm">You value spa-like clinics over clinical white walls.</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-white text-stone-900 hover:bg-stone-200 py-6 text-lg font-bold mb-3">
                                See 3 Matched Doctors
                            </Button>
                            <button className="text-stone-500 hover:text-white text-sm underline decoration-stone-700">Share My Style Card</button>
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

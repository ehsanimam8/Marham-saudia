"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Gamepad2, Heart, Star, Zap, Brain, Salad, Smile, User, Check, Trophy, Flame, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Game Constants ---
const LEVELS = 4;
const CARDS = [
    { id: 1, content: '🥗', matchId: 1 },
    { id: 2, content: '💪', matchId: 2 },
    { id: 3, content: '🧠', matchId: 3 },
    { id: 4, content: '🥗', matchId: 1 },
    { id: 5, content: '💪', matchId: 2 },
    { id: 6, content: '🧠', matchId: 3 },
];

export default function OnboardingV2() {
    const [level, setLevel] = useState(0); // 0: Intro, 1: Energy, 2: Body, 3: Memory, 4: Win
    const [energy, setEnergy] = useState(50);
    const [xp, setXp] = useState(0);
    const [hearts, setHearts] = useState(3);

    // Level 3 Memory State
    const [cards, setCards] = useState(CARDS.sort(() => Math.random() - 0.5));
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);

    // Level 2 Body State
    const [bodyTaps, setBodyTaps] = useState<string[]>([]);

    // XP Gains
    const addXp = (amount: number) => {
        setXp(prev => prev + amount);
    };

    // Memory Logic
    useEffect(() => {
        if (flipped.length === 2) {
            const [first, second] = flipped;
            const card1 = cards.find(c => c.id === first);
            const card2 = cards.find(c => c.id === second);

            if (card1 && card2 && card1.matchId === card2.matchId) {
                setMatched([...matched, first, second]);
                setFlipped([]);
                addXp(20);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    }, [flipped, cards, matched]);

    const handleNextLevel = () => {
        setLevel(prev => Math.min(prev + 1, LEVELS));
    };

    return (
        <div className="min-h-screen bg-indigo-950 text-white font-sans overflow-hidden selection:bg-purple-500 relative" dir="ltr">

            {/* Game HUD */}
            <div className="fixed top-0 left-0 w-full p-4 z-50 flex justify-between items-center bg-indigo-900/50 backdrop-blur-md border-b border-indigo-800">
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <Heart key={i} className={cn("w-6 h-6 fill-red-500 text-red-500 transition-all", i >= hearts && "opacity-20")} />
                    ))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Level {Math.max(1, level)}/{LEVELS}</span>
                    <div className="w-32 h-2 bg-indigo-800 rounded-full mt-1 overflow-hidden">
                        <motion.div
                            className="h-full bg-yellow-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${(level / LEVELS) * 100}% ` }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-indigo-800 px-3 py-1 rounded-full border border-indigo-700">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold font-mono">{xp} XP</span>
                </div>
            </div>

            <AnimatePresence mode="wait">

                {/* --- LEVEL 0: INTRO --- */}
                {level === 0 && (
                    <motion.div
                        key="intro"
                        className="h-screen flex flex-col items-center justify-center p-6 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mb-6"
                        >
                            <Gamepad2 className="w-24 h-24 text-purple-400" />
                        </motion.div>

                        <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            WELLNESS QUEST
                        </h1>
                        <p className="text-xl text-indigo-200 mb-8" dir="rtl">مغامرة صحتك تبدأ الآن</p>

                        <div className="bg-indigo-900/50 p-6 rounded-xl border border-indigo-700 max-w-sm mb-8">
                            <p className="mb-2">🏆 Complete 3 challenges</p>
                            <p className="mb-2">⚡ Earn XP</p>
                            <p>🎁 Unlock Rewards</p>
                        </div>

                        <Button
                            onClick={handleNextLevel}
                            className="bg-green-500 hover:bg-green-600 text-black font-black text-xl px-12 py-8 rounded-2xl shadow-[0_6px_0_#15803d] active:shadow-none active:translate-y-1.5 transition-all"
                        >
                            START GAME 🎮
                        </Button>
                    </motion.div>
                )}

                {/* --- LEVEL 1: ENERGY SLIDER --- */}
                {level === 1 && (
                    <motion.div
                        key="level1"
                        className="h-screen flex flex-col items-center justify-center p-6 text-center"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-8">LEVEL 1: Check Your Energy</h2>

                        <div className="w-full max-w-md bg-indigo-900 p-8 rounded-3xl border-2 border-indigo-700 shadow-xl relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-950 p-3 rounded-full border-2 border-indigo-700">
                                <Zap className={cn("w-10 h-10 transition-colors", energy > 80 ? "text-yellow-400 fill-yellow-400" : energy < 30 ? "text-gray-500" : "text-blue-400")} />
                            </div>

                            <div className="mt-8 mb-8">
                                <div className="flex justify-between text-indigo-300 text-sm mb-4 font-bold">
                                    <span>😴 EXHAUSTED</span>
                                    <span>HYPER 🚀</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={energy}
                                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                                    className="w-full h-4 bg-indigo-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="mt-4 text-center font-mono text-3xl font-bold text-yellow-400">
                                    {energy}%
                                </div>
                            </div>

                            <Button
                                onClick={() => { addXp(25); handleNextLevel(); }}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 rounded-xl shadow-lg"
                            >
                                CONFIRM ENERGY ⚡
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* --- LEVEL 2: BODY ZONES --- */}
                {level === 2 && (
                    <motion.div
                        key="level2"
                        className="h-screen flex flex-col items-center justify-center p-6 text-center"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-2">LEVEL 2: Body Scan</h2>
                        <p className="text-indigo-300 mb-8">Tap areas you want to improve</p>

                        <div className="relative w-64 h-96 bg-indigo-800 rounded-[3rem] border-4 border-indigo-600 shadow-2xl flex items-center justify-center">
                            {/* Abstract Body Represented by Interactive Nodes */}

                            {/* Head */}
                            <button
                                onClick={() => {
                                    if (!bodyTaps.includes('head')) { setBodyTaps([...bodyTaps, 'head']); addXp(10); }
                                }}
                                className={cn("absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center", bodyTaps.includes('head') ? "bg-purple-500 border-white shadow-[0_0_20px_rgba(168,85,247,0.6)]" : "bg-indigo-900 border-indigo-500")}
                            >
                                <Brain className="w-8 h-8 opacity-50" />
                            </button>

                            {/* Chest */}
                            <button
                                onClick={() => {
                                    if (!bodyTaps.includes('chest')) { setBodyTaps([...bodyTaps, 'chest']); addXp(10); }
                                }}
                                className={cn("absolute top-32 left-1/2 -translate-x-1/2 w-32 h-20 rounded-2xl border-2 transition-all", bodyTaps.includes('chest') ? "bg-purple-500 border-white shadow-[0_0_20px_rgba(168,85,247,0.6)]" : "bg-indigo-900 border-indigo-500")}
                            />

                            {/* Stomach */}
                            <button
                                onClick={() => {
                                    if (!bodyTaps.includes('stomach')) { setBodyTaps([...bodyTaps, 'stomach']); addXp(10); }
                                }}
                                className={cn("absolute top-56 left-1/2 -translate-x-1/2 w-28 h-24 rounded-full border-2 transition-all", bodyTaps.includes('stomach') ? "bg-purple-500 border-white shadow-[0_0_20px_rgba(168,85,247,0.6)]" : "bg-indigo-900 border-indigo-500")}
                            />

                        </div>

                        <div className="mt-8 flex gap-4">
                            <span className="text-sm font-mono text-purple-300">{bodyTaps.length} Zones Selected</span>
                            <Button
                                disabled={bodyTaps.length === 0}
                                onClick={handleNextLevel}
                                className="bg-blue-600 hover:bg-blue-500"
                            >
                                Next Level <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* --- LEVEL 3: MEMORY GAME --- */}
                {level === 3 && (
                    <motion.div
                        key="level3"
                        className="h-screen flex flex-col items-center justify-center p-6 text-center"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-2">LEVEL 3: Mind Match</h2>
                        <p className="text-indigo-300 mb-8">Find the matching pairs!</p>

                        <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-8">
                            {cards.map((card, index) => {
                                const isCardFlipped = flipped.includes(card.id) || matched.includes(card.id);
                                return (
                                    <motion.button
                                        key={card.id}
                                        layout
                                        onClick={() => {
                                            if (!isCardFlipped && flipped.length < 2) {
                                                setFlipped([...flipped, card.id]);
                                            }
                                        }}
                                        className={cn(
                                            "aspect-square rounded-xl text-4xl flex items-center justify-center border-b-4 transition-all active:border-b-0 active:translate-y-1",
                                            isCardFlipped ? "bg-white border-gray-200" : "bg-indigo-700 border-indigo-900 text-transparent"
                                        )}
                                        animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                                    >
                                        <div style={{ transform: isCardFlipped ? "rotateY(180deg)" : "" }}>
                                            {isCardFlipped ? card.content : "?"}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <Button
                            disabled={matched.length < CARDS.length}
                            onClick={() => { addXp(50); handleNextLevel(); }}
                            className={cn(
                                "w-full max-w-sm font-bold py-4 rounded-xl transition-all",
                                matched.length === CARDS.length
                                    ? "bg-green-500 hover:bg-green-600 text-black shadow-lg animate-bounce"
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            {matched.length === CARDS.length ? "FINISH QUEST! 🏆" : "Match All to Finish"}
                        </Button>
                    </motion.div>
                )}

                {/* --- VICTORY SCREEN --- */}
                {level === 4 && (
                    <motion.div
                        key="victory"
                        className="h-screen flex flex-col items-center justify-center p-6 text-center"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <motion.div
                            initial={{ y: -50 }}
                            animate={{ y: 0 }}
                            transition={{ type: "spring" }}
                            className="mb-8 relative"
                        >
                            <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 animate-pulse" />
                            <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-lg mx-auto" />
                        </motion.div>

                        <h1 className="text-5xl font-black text-white italic mb-2 tracking-tighter">
                            QUEST COMPLETE!
                        </h1>
                        <p className="text-xl text-yellow-300 font-bold mb-8">New High Score: {xp} XP</p>

                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-sm mb-8 text-left">
                            <p className="text-xs text-indigo-300 uppercase font-bold mb-2">Rewards Unlocked</p>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-purple-600 p-3 rounded-lg"><Flame className="w-6 h-6 text-white" /></div>
                                <div>
                                    <p className="font-bold">Health Warrior Badge</p>
                                    <p className="text-xs text-indigo-300">Rare Achievement</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-green-600 p-3 rounded-lg"><Check className="w-6 h-6 text-white" /></div>
                                <div>
                                    <p className="font-bold">Free Assessment</p>
                                    <p className="text-xs text-indigo-300">Worth SAR 200</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full max-w-sm bg-white text-indigo-900 hover:bg-indigo-100 font-bold py-4 rounded-xl">
                            Claim Rewards
                        </Button>

                        <div className="mt-8 text-sm text-indigo-400">
                            <p>Want to play again?</p>
                            <button onClick={() => { setLevel(0); setXp(0); setBodyTaps([]); setMatched([]); }} className="text-white underline hover:text-purple-300">Restart Game</button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

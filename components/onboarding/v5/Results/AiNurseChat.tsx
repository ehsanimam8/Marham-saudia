'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, X, Mic, MicOff, Volume2, VolumeX, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { startAiChat, sendAiMessage, getChatHistory } from '@/app/actions/ai_nurse';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface AiNurseChatProps {
    sessionId: string;
    onClose: () => void;
    onComplete?: () => void;
}

export default function AiNurseChat({ sessionId, onClose, onComplete }: AiNurseChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    // Voice State
    const [isVoiceMode, setIsVoiceMode] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasStarted, setHasStarted] = useState(false); // NEW: User must click to start
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize chat & Speech APIs
    useEffect(() => {
        // Init Speech Synthesis
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthesisRef.current = window.speechSynthesis;
        }

        const initChat = async () => {
            setIsLoading(true);
            try {
                const { chatId, isNew } = await startAiChat(sessionId);
                setChatId(chatId);

                const history = await getChatHistory(chatId);
                setMessages(history as Message[]);
            } catch (e) {
                console.error("Failed to init chat", e);
            } finally {
                setIsLoading(false);
            }
        };
        initChat();

        return () => {
            stopListening();
            stopSpeaking();
        };
    }, [sessionId]);

    // Separate effect for greeting speech
    useEffect(() => {
        // Only speak greeting if user has explicitly started the session
        if (hasStarted && messages.length === 1 && messages[0].role === 'assistant' && isVoiceMode && !isSpeaking) {
            speak(messages[0].content);
        }
    }, [messages, isVoiceMode, hasStarted]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // --- Voice Logic ---

    const speak = (text: string) => {
        if (!synthesisRef.current) return;

        stopSpeaking(); // Stop any current speech
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        // Detect language of the text
        const isArabic = /[\u0600-\u06FF]/.test(text);
        utterance.lang = isArabic ? 'ar-SA' : 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Select Voice based on language
        const voices = synthesisRef.current.getVoices();
        let preferredVoice = null;

        if (isArabic) {
            preferredVoice = voices.find(v => v.lang.includes('ar') || v.name.includes('Arabic'));
        } else {
            preferredVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Female'));
        }

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
            setIsSpeaking(false);
            if (isVoiceMode && !isCompleted) {
                // Determine listening language based on the question asked?? 
                // Or just default to Arabic for Marham user base?
                // Let's toggle listening language based on what was spoken? 
                // No, user might reply in either. 
                // Web Speech API doesn't support dual lang listening well.
                // We'll Default to 'ar-SA' for listening as it covers the target demographic.
                startListening();
            }
        };

        console.log('🔊 Starting speech synthesis:', text);
        synthesisRef.current.speak(utterance);
    };

    const stopSpeaking = () => {
        if (synthesisRef.current) {
            console.log('🔇 Stopping speech');
            synthesisRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const startListening = () => {
        console.log('🎤 Initializing speech recognition...');
        if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
            toast.error("Voice input is not supported in this browser.");
            return;
        }

        if (isListening) return;

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'ar-SA';

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
                handleSend(transcript);
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error("Failed to start recognition", e);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleSend = async (textInput?: string) => {
        const messageText = textInput || input;

        if (!messageText.trim() || !chatId || isLoading) return;

        setInput('');

        const tempMsg: Message = { id: Date.now().toString(), role: 'user', content: messageText };
        setMessages(prev => [...prev, tempMsg]);
        setIsLoading(true);

        try {
            const result = await sendAiMessage(chatId, messageText);

            const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: result.message };
            setMessages(prev => [...prev, botMsg]);

            if (isVoiceMode) {
                speak(result.message);
            }

            if (result.completed) {
                setIsCompleted(true);
                stopSpeaking(); // Ensure it speaks the final message but stop listening loop
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVoiceMode = () => {
        const newMode = !isVoiceMode;
        setIsVoiceMode(newMode);
        if (newMode) {
            startListening();
        } else {
            stopSpeaking();
            stopListening();
            setIsSpeaking(false);
            setIsListening(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white sm:rounded-xl sm:inset-4 md:inset-10 shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between text-white shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Marham AI Nurse</h3>
                        <p className="text-xs text-purple-100 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Online • Personal Assessment
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleVoiceMode}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            isVoiceMode ? "bg-white/20 hover:bg-white/30" : "hover:bg-white/10"
                        )}
                        title={isVoiceMode ? "Switch to Text" : "Switch to Voice"}
                    >
                        {isVoiceMode ? <Keyboard className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Voice Visualization Area (Only visible in Voice Mode) */}
            <AnimatePresence>
                {isVoiceMode && !isCompleted && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center py-12 shrink-0 border-b border-slate-800"
                    >
                        {/* Start Overlay */}
                        {!hasStarted ? (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                <Button
                                    size="lg"
                                    onClick={() => setHasStarted(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-8 rounded-full shadow-xl animate-bounce"
                                >
                                    Start Assessment
                                </Button>
                            </div>
                        ) : null}

                        {/* Status Text */}
                        <div className="absolute top-4 text-white/60 text-sm font-medium">
                            {isSpeaking ? "Nurse is speaking..." : isListening ? "Listening to you..." : isLoading ? "Thinking..." : "Ready"}
                        </div>

                        {/* Orb Animation */}
                        <div className="relative w-32 h-32 flex items-center justify-center mt-6">
                            {/* Listening Pulse */}
                            {isListening && hasStarted && (
                                <>
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 bg-purple-500 rounded-full blur-xl"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="absolute inset-2 bg-purple-400 rounded-full blur-md opacity-50"
                                    />
                                </>
                            )}

                            {/* Speaking Pulse */}
                            {isSpeaking && hasStarted && (
                                <>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                        className="absolute inset-0 bg-green-500 rounded-full blur-xl"
                                    />
                                </>
                            )}

                            {/* Center Core */}
                            <div className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 z-10",
                                isSpeaking ? "bg-gradient-to-br from-green-400 to-emerald-600" :
                                    isListening ? "bg-gradient-to-br from-purple-500 to-indigo-600" :
                                        "bg-slate-700"
                            )}>
                                <Mic className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-full px-8 backdrop-blur-sm"
                                onClick={isListening ? stopListening : startListening}
                                disabled={!hasStarted}
                            >
                                {isListening ? "Pause Listening" : "Tap to Speak"}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-0">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={cn(
                            "flex w-full",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
                            msg.role === 'user'
                                ? "bg-purple-600 text-white rounded-br-none"
                                : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                        )}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 rounded-bl-none shadow-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            <span className="text-xs text-gray-500">Nurse is typing...</span>
                        </div>
                    </div>
                )}

                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="my-8 mx-auto max-w-sm bg-green-50 border border-green-200 rounded-xl p-6 text-center"
                    >
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bot className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-green-900 mb-2">Assessment Complete</h4>
                        <p className="text-sm text-green-800 mb-4">
                            Thank you. I have recorded all details for the doctor.
                        </p>
                        <Button
                            onClick={onComplete}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                            Proceed to Scheduling
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Input Area (Visible but less prominent in Voice Mode) */}
            <div className={cn("p-4 bg-white border-t border-slate-100", isCompleted && "hidden")}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your answer here..."
                        className="flex-1 bg-slate-50 border-slate-200 focus:ring-purple-500"
                        disabled={isLoading || isListening}
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white w-12 h-10 px-0 rounded-lg flex items-center justify-center shrink-0"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}

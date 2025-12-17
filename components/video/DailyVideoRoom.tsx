'use client';

import { DailyProvider, useDaily, useCallObject } from '@daily-co/daily-react';
import DailyIframe from '@daily-co/daily-js';
import { useEffect, useState, useRef } from 'react';

// Wrapper Component that provides context
export default function DailyVideoRoom({
    url,
    token,
    onLeave
}: {
    url: string;
    token: string;
    onLeave: () => void;
}) {
    // Create call object
    const callFrame = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!url || !containerRef.current) return;

        let active = true; // Flag to prevent multiple creations in this specific effect run if strict mode goes crazy
        let newFrame: any = null;

        const initDaily = async () => {
            console.log("Initializing Daily Frame...");

            // 1. Check if ANY Daily instance exists globally (Strict Mode leftover)
            const existing = DailyIframe.getCallInstance();
            if (existing) {
                console.warn("Found existing Daily instance. Destroying it before creating new one.");
                try {
                    await existing.destroy();
                } catch (e) {
                    console.error("Error destroying existing instance:", e);
                }
            }

            if (!active) return; // Component might have unmounted while we waited
            if (!containerRef.current) return;

            try {
                console.log("Creating new Daily Frame", url);
                newFrame = DailyIframe.createFrame(containerRef.current, {
                    showLeaveButton: true,
                    iframeStyle: {
                        width: '100%',
                        height: '100%',
                        border: '0',
                        borderRadius: '12px',
                    }
                });

                callFrame.current = newFrame;

                await newFrame.join({ url, token });
                console.log('✅ Joined Daily call');

                newFrame.on('left-meeting', (event: any) => {
                    console.log("👋 Left meeting event", event);
                });

            } catch (error) {
                console.error("❌ Error initializing/joining Daily:", error);
            }
        };

        initDaily();

        return () => {
            console.log("Cleaning up Daily Frame (Effect Cleanup)");
            active = false;
            // We do NOT destroy here immediately if we are relying on the next mount to check getCallInstance
            // ACTUALLY, we SHOULD destroy here.
            // But since destroy is async, we can't block here.
            // The next mount's check for getCallInstance() will handle the wait.
            if (newFrame) {
                // Try to mark it for destruction
                const destroy = async () => {
                    try {
                        await newFrame.destroy();
                    } catch (e) {
                        console.error("Destroy error", e);
                    }
                }
                destroy();
            }
            callFrame.current = null;
        };
    }, [url, token]);

    return (
        <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden relative">
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
}

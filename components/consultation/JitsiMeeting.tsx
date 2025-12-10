'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface JitsiMeetingProps {
    roomName: string;
    displayName: string;
    email: string;
    onApiReady?: (api: any) => void;
    onReadyToClose?: () => void;
    height?: string;
    width?: string;
}

export default function ConsultationJitsi({
    roomName,
    displayName,
    email,
    onApiReady,
    onReadyToClose,
    height = '100%',
    width = '100%'
}: JitsiMeetingProps) {
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-10 bg-gray-900/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                        <p>جاري الاتصال بغرفة الاستشارة...</p>
                    </div>
                </div>
            )}

            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: false,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    prejoinPageEnabled: true, // Enable prejoin to allow moderator login for testing
                    // Getting into room directly is usually better for custom UI flow if check was done before.
                    // Spec says "Test your camera" before join.
                    // Let's keep prejoinPageEnabled: false and rely on Jitsi UI inside.
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                    // Branding
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_BACKGROUND: '#0d9488', // Teal background
                }}
                userInfo={{
                    displayName: displayName,
                    email: email
                }}
                onApiReady={(externalApi) => {
                    setLoading(false);
                    // externalApi.executeCommand('toggleAudio'); 
                    if (onApiReady) onApiReady(externalApi);
                }}
                onReadyToClose={onReadyToClose}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = height;
                    iframeRef.style.width = width;
                }}
            />
        </div>
    );
}

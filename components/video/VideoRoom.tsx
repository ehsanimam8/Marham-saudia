'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from 'lucide-react';

interface VideoRoomProps {
    roomName: string;
    displayName: string;
    email?: string;
    onEnd?: () => void;
}

export default function VideoRoom({ roomName, displayName, email, onEnd }: VideoRoomProps) {
    return (
        <div className="h-[calc(100vh-80px)] w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
                }}
                interfaceConfigOverwrite={{
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                }}
                userInfo={{
                    displayName: displayName,
                    email: email || ''
                }}
                onApiReady={(externalApi) => {
                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // e.g. externalApi.addEventListener('videoConferenceLeft', () => { ... });
                    if (onEnd) {
                        externalApi.addEventListener('videoConferenceLeft', onEnd);
                    }
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                }}
                spinner={() => (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
                        <span className="ml-3 font-medium">جاري الاتصال بالعيادة الافتراضية...</span>
                    </div>
                )}
            />
        </div>
    );
}

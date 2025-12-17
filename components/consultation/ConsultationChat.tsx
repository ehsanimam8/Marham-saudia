
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, X, File as FileIcon, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { uploadConsultationFile } from '@/app/actions/consultation-upload';

interface Message {
    id: string;
    sender_id: string;
    sender_role: 'doctor' | 'patient' | 'system';
    message: string;
    is_file: boolean;
    file_url?: string;
    file_type?: string;
    file_name?: string;
    created_at: string;
}

interface ConsultationChatProps {
    appointmentId: string;
    userRole: 'doctor' | 'patient';
    userId: string;
    className?: string; // For custom positioning/sizing
}

export default function ConsultationChat({ appointmentId, userRole, userId, className }: ConsultationChatProps) {
    const supabase = createClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // File Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileDescription, setFileDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    useEffect(() => {
        fetchMessages();
        const subscription = subscribeToMessages();
        return () => {
            subscription.unsubscribe();
        };
    }, [appointmentId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('consultation_chats')
            .select('*')
            .eq('appointment_id', appointmentId)
            .order('created_at', { ascending: true });

        if (error) console.error(error);
        else setMessages(data || []);

        setLoading(false);
    };

    const subscribeToMessages = () => {
        return supabase
            .channel(`chat_${appointmentId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'consultation_chats',
                filter: `appointment_id=eq.${appointmentId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message]);
            })
            .subscribe();
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const msg = newMessage.trim(); // store locally
        setNewMessage(''); // clear input immediately for responsiveness

        const { error } = await supabase
            .from('consultation_chats')
            .insert({
                appointment_id: appointmentId,
                sender_id: userId,
                sender_role: userRole,
                message: msg,
                is_file: false
            });

        if (error) {
            toast.error('Failed to send message');
            setNewMessage(msg); // revert
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setShowUploadDialog(true);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        if (!fileDescription.trim()) {
            toast.error('Please provide a description for the file.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('description', fileDescription);
            formData.append('appointmentId', appointmentId);
            formData.append('userId', userId);
            formData.append('userRole', userRole);

            const result = await uploadConsultationFile(formData);

            if (!result.success) {
                throw new Error(result.error);
            }

            setShowUploadDialog(false);
            setSelectedFile(null);
            setFileDescription('');
            toast.success('File uploaded successfully');

        } catch (error: any) {
            console.error(error);
            toast.error('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`flex flex-col bg-white h-full shadow-lg ${className}`}>
            {/* Header */}
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                <span className="font-semibold text-sm">Consultation Chat</span>
                {/* Close button handled by parent usually, but we can have one locally if needed */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {loading ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin h-5 w-5 text-gray-400" /></div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        <p>No messages yet.</p>
                        <p className="text-xs">You can share text, reports, and images here.</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_role === userRole;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                                    }`}>
                                    {msg.is_file ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 font-medium border-b border-white/20 pb-1 mb-1">
                                                {msg.file_type?.includes('image') ? <ImageIcon className="w-4 h-4" /> : <FileIcon className="w-4 h-4" />}
                                                <span className="truncate max-w-[150px]">{msg.file_name}</span>
                                            </div>
                                            {msg.file_type?.includes('image') && (
                                                <img src={msg.file_url} alt="attachment" className="rounded-md max-h-48 object-cover bg-black/10" />
                                            )}
                                            {msg.message && <p className="opacity-90">{msg.message}</p>}
                                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="text-xs underline mt-1 opacity-80 hover:opacity-100">
                                                Download/View
                                            </a>
                                        </div>
                                    ) : (
                                        <p>{msg.message}</p>
                                    )}
                                    <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex gap-2 items-center">
                <Button variant="ghost" size="icon" className="shrink-0 text-gray-500" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                </Button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                />
            </div>

            {/* Upload Dialog */}
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Details Required</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe this file (e.g., 'Blood Test Report', 'X-Ray of Left Knee')..."
                                value={fileDescription}
                                onChange={(e) => setFileDescription(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">This file will be saved to your medical records.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
                        <Button onClick={handleUpload} disabled={uploading}>
                            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upload & Send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

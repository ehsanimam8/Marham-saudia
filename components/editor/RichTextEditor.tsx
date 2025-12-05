'use client';

import { AlignLeft, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-teal-600/20 transition-all">
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                {/* Mock Toolbar - Visual only for MVP fallback */}
                <Button variant="ghost" size="sm" disabled className="text-gray-400">
                    <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" disabled className="text-gray-400">
                    <Italic className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button variant="ghost" size="sm" disabled className="text-gray-400">
                    <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" disabled className="text-gray-400">
                    <List className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button variant="ghost" size="sm" disabled className="text-gray-400">
                    <LinkIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" disabled className="text-gray-400">
                    <ImageIcon className="w-4 h-4" />
                </Button>
            </div>
            <textarea
                className="w-full h-[300px] p-4 resize-none focus:outline-none text-gray-700 leading-relaxed"
                placeholder="ابدأ كتابة مقالك هنا..."
                value={content}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="bg-yellow-50 px-4 py-2 text-xs text-yellow-700 border-t border-yellow-100">
                ملاحظة: المحرر المتطور قيد الصيانة، يمكنك الكتابة بالنص العادي حالياً.
            </div>
        </div>
    );
}

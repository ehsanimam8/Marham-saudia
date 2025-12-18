'use client';

import { useState } from 'react';
import { upsertBodyPart, deleteBodyPart } from '@/app/actions/admin_onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Save, X, ImageIcon, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import ConcernsManager from './ConcernsManager';

// Helper to render icon preview
const IconPreview = ({ icon }: { icon?: string }) => {
    if (!icon) return <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400">?</div>;

    // Check if URL
    if (icon.startsWith('http') || icon.startsWith('/')) {
        return (
            <div className="relative w-8 h-8 rounded overflow-hidden border border-gray-200">
                <Image src={icon} alt="icon" fill className="object-cover" />
            </div>
        );
    }

    // Lucide name (simulated preview or just text)
    return <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs" title={icon}>{icon.substring(0, 2)}</div>;
};

export default function OnboardingManager({ initialData }: { initialData: any[] }) {
    const [categories, setCategories] = useState(initialData);
    const [editingPart, setEditingPart] = useState<any | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState<string>(initialData[0]?.id || '');

    const handleEdit = (part: any) => {
        setEditingPart({ ...part });
        setIsCreating(false);
    };

    const handleCreate = (categoryId: string) => {
        setEditingPart({
            category_id: categoryId,
            name_en: '',
            name_ar: '',
            icon: 'Activity', // Default
            display_order: 0,
            description_en: '',
            description_ar: ''
        });
        setIsCreating(true);
    };

    const handleSave = async () => {
        try {
            if (!editingPart) return;
            await upsertBodyPart(editingPart);
            toast.success(isCreating ? 'Created successfully' : 'Updated successfully');
            setEditingPart(null);
            // In a real app we'd optimistically update or re-fetch, but server action revalidates path so a refresh might be needed for simple logic
            // Ideally we pass a refresh callback or use router.refresh()
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await deleteBodyPart(id);
            toast.success('Deleted successfully');
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // ... (in component)
    const [managingContentFor, setManagingContentFor] = useState<any | null>(null);

    if (managingContentFor) {
        return (
            <div className="space-y-6">
                <Button variant="outline" onClick={() => setManagingContentFor(null)} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Body Parts
                </Button>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <IconPreview icon={managingContentFor.icon} />
                        {managingContentFor.name_en}
                        <span className="text-gray-400 text-base font-normal">/ Content Manager</span>
                    </h2>
                    <ConcernsManager bodyPartId={managingContentFor.id} bodyPartName={managingContentFor.name_en} />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List View */}
            <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue={activeCategoryId} onValueChange={setActiveCategoryId} className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 flex-wrap">
                        {categories.map(cat => (
                            <TabsTrigger key={cat.id} value={cat.id} className="py-2">
                                {cat.name_en}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map(cat => (
                        <TabsContent key={cat.id} value={cat.id} className="mt-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Body Parts in {cat.name_en}</h2>
                                <Button size="sm" onClick={() => handleCreate(cat.id)}>
                                    <Plus className="w-4 h-4 mr-2" /> Add New Part
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {cat.parts.map((part: any) => (
                                    <Card key={part.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <IconPreview icon={part.icon} />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 truncate">{part.name_en}</h3>
                                                <p className="text-xs text-gray-500 truncate">{part.name_ar}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-xs" onClick={() => setManagingContentFor(part)}>
                                                    Manage Questions
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(part)}>
                                                    <Edit className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(part.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {cat.parts.length === 0 && (
                                    <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed rounded-lg">
                                        No parts defined yet.
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Editor Panel */}
            <div className="lg:col-span-1">
                <div className="sticky top-6">
                    {editingPart ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle>{isCreating ? 'Add New Part' : 'Edit Part'}</CardTitle>
                                <Button size="icon" variant="ghost" onClick={() => setEditingPart(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>English Name</Label>
                                    <Input
                                        value={editingPart.name_en}
                                        onChange={e => setEditingPart({ ...editingPart, name_en: e.target.value })}
                                        placeholder="e.g. Face"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Arabic Name</Label>
                                    <Input
                                        value={editingPart.name_ar}
                                        onChange={e => setEditingPart({ ...editingPart, name_ar: e.target.value })}
                                        placeholder="e.g. الوجه"
                                        className="text-right"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icon (Lucide Name OR Image URL)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={editingPart.icon || ''}
                                            onChange={e => setEditingPart({ ...editingPart, icon: e.target.value })}
                                            placeholder="Smile, Heart, or https://..."
                                        />
                                        <div className="shrink-0 flex items-center justify-center w-10 h-10 border rounded bg-gray-50">
                                            <IconPreview icon={editingPart.icon} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Tip: Use standard icon names like 'Smile', 'Heart' OR paste a direct image URL for custom icons.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description (EN, Optional)</Label>
                                    <Input
                                        value={editingPart.description_en || ''}
                                        onChange={e => setEditingPart({ ...editingPart, description_en: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description (AR, Optional)</Label>
                                    <Input
                                        value={editingPart.description_ar || ''}
                                        onChange={e => setEditingPart({ ...editingPart, description_ar: e.target.value })}
                                        className="text-right"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Order</Label>
                                    <Input
                                        type="number"
                                        value={editingPart.display_order || 0}
                                        onChange={e => setEditingPart({ ...editingPart, display_order: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <Button className="w-full" onClick={handleSave}>
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-gray-50 border-dashed">
                            <CardContent className="py-12 text-center text-gray-400">
                                <Edit className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Select an item to edit or create a new one.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

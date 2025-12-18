'use client';

import { useState, useEffect } from 'react';
import { getConcerns, upsertConcern, deleteConcern, getQuestions, upsertQuestion, deleteQuestion } from '@/app/actions/admin_onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X, ChevronRight, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ConcernsManager({ bodyPartId, bodyPartName }: { bodyPartId: string, bodyPartName: string }) {
    const [concerns, setConcerns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingConcern, setEditingConcern] = useState<any | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
    const [selectedConcernId, setSelectedConcernId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        loadConcerns();
    }, [bodyPartId]);

    useEffect(() => {
        if (selectedConcernId) {
            loadQuestions(selectedConcernId);
        } else {
            setQuestions([]);
        }
    }, [selectedConcernId]);

    const loadConcerns = async () => {
        setLoading(true);
        try {
            const data = await getConcerns(bodyPartId);
            setConcerns(data || []);
        } catch (error) {
            toast.error('Failed to load concerns');
        } finally {
            setLoading(false);
        }
    };

    const loadQuestions = async (concernId: string) => {
        try {
            const data = await getQuestions(concernId);
            setQuestions(data || []);
        } catch (error) {
            toast.error('Failed to load questions');
        }
    };

    const handleSaveConcern = async () => {
        try {
            if (!editingConcern) return;
            await upsertConcern({ ...editingConcern, body_part_id: bodyPartId });
            toast.success('Concern saved');
            setEditingConcern(null);
            loadConcerns();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteConcern = async (id: string) => {
        if (!confirm('Delete concern? This will delete all associated questions.')) return;
        try {
            await deleteConcern(id);
            toast.success('Deleted');
            loadConcerns();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleSaveQuestion = async () => {
        try {
            if (!editingQuestion || !selectedConcernId) return;
            await upsertQuestion({ ...editingQuestion, concern_id: selectedConcernId });
            toast.success('Question saved');
            setEditingQuestion(null);
            loadQuestions(selectedConcernId);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('Delete question?')) return;
        try {
            await deleteQuestion(id);
            toast.success('Deleted');
            if (selectedConcernId) loadQuestions(selectedConcernId);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold">Concerns for: {bodyPartName}</h3>
                <Button size="sm" onClick={() => setEditingConcern({ name_en: '', name_ar: '', urgency_default: 'routine' })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Concern
                </Button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Concerns List */}
                    <div className="space-y-4">
                        {concerns.map(c => (
                            <Card key={c.id} className={`cursor-pointer transition-all ${selectedConcernId === c.id ? 'ring-2 ring-teal-500' : ''}`} onClick={() => setSelectedConcernId(c.id)}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{c.name_en}</p>
                                        <p className="text-xs text-gray-500">{c.name_ar}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setEditingConcern(c); }}>
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteConcern(c.id); }}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Questions List (Contextual) */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-dashed min-h-[300px]">
                        {selectedConcernId ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-sm text-gray-700">Follow-up Questions</h4>
                                    <Button size="sm" variant="outline" onClick={() => setEditingQuestion({ question_en: '', question_ar: '', question_type: 'boolean' })}>
                                        <Plus className="w-3 h-3 mr-1" /> Add Question
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {questions.map(q => (
                                        <div key={q.id} className="bg-white p-3 rounded shadow-sm flex justify-between">
                                            <div>
                                                <p className="text-sm font-medium">{q.question_en}</p>
                                                <p className="text-xs text-gray-400">{q.question_type}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditingQuestion(q)}>
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => handleDeleteQuestion(q.id)}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {questions.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No questions defined.</p>}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <HelpCircle className="w-8 h-8 mb-2" />
                                <p className="text-sm">Select a concern to manage its questions</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Concern Editor Dialog/Overlay */}
            {editingConcern && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>{editingConcern.id ? 'Edit Concern' : 'New Concern'}</CardTitle>
                            <Button size="icon" variant="ghost" onClick={() => setEditingConcern(null)}><X className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Name EN" value={editingConcern.name_en} onChange={e => setEditingConcern({ ...editingConcern, name_en: e.target.value })} />
                            <Input placeholder="Name AR" className="text-right" value={editingConcern.name_ar} onChange={e => setEditingConcern({ ...editingConcern, name_ar: e.target.value })} />
                            <Input placeholder="Description EN" value={editingConcern.description_en || ''} onChange={e => setEditingConcern({ ...editingConcern, description_en: e.target.value })} />
                            <Input placeholder="Icon (Lucide/URL)" value={editingConcern.icon || ''} onChange={e => setEditingConcern({ ...editingConcern, icon: e.target.value })} />
                            <Button className="w-full" onClick={handleSaveConcern}>Save Concern</Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Question Editor Dialog/Overlay */}
            {editingQuestion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>{editingQuestion.id ? 'Edit Question' : 'New Question'}</CardTitle>
                            <Button size="icon" variant="ghost" onClick={() => setEditingQuestion(null)}><X className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Question EN" value={editingQuestion.question_en} onChange={e => setEditingQuestion({ ...editingQuestion, question_en: e.target.value })} />
                            <Input placeholder="Question AR" className="text-right" value={editingQuestion.question_ar} onChange={e => setEditingQuestion({ ...editingQuestion, question_ar: e.target.value })} />

                            <div className="flex gap-2">
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editingQuestion.question_type}
                                    onChange={e => setEditingQuestion({ ...editingQuestion, question_type: e.target.value })}
                                >
                                    <option value="boolean">Yes/No</option>
                                    <option value="text">Free Text</option>
                                    <option value="multiple_choice">Multiple Choice</option>
                                </select>
                            </div>

                            <Button className="w-full" onClick={handleSaveQuestion}>Save Question</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

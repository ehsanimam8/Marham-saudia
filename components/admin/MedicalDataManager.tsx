'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Search } from 'lucide-react';
import { deleteConcern, deleteSymptom, createConcern } from '@/app/actions/admin_taxonomy';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ManagerProps {
    initialConcerns: any[];
    initialSymptoms: any[];
    initialQuestions: any[];
}

export default function MedicalDataManager({ initialConcerns, initialSymptoms, initialQuestions }: ManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [concerns, setConcerns] = useState(initialConcerns);
    const [symptoms, setSymptoms] = useState(initialSymptoms);

    // Filter
    const filteredConcerns = concerns.filter(c =>
        c.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.includes(searchTerm.toLowerCase())
    );

    const handleDeleteConcern = async (id: string) => {
        if (!confirm('Are you sure? This will delete associated symptoms too.')) return;
        await deleteConcern(id);
        setConcerns(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="concerns" className="w-full">
                <TabsList>
                    <TabsTrigger value="concerns">Concerns ({concerns.length})</TabsTrigger>
                    <TabsTrigger value="symptoms">Symptoms ({symptoms.length})</TabsTrigger>
                    <TabsTrigger value="questions">Questions ({initialQuestions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="concerns" className="space-y-4">
                    <div className="flex justify-end">
                        <AddConcernDialog />
                    </div>
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name (EN)</TableHead>
                                    <TableHead>Body Part</TableHead>
                                    <TableHead>Urgency</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredConcerns.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                                        <TableCell className="font-medium">{item.name_en}</TableCell>
                                        <TableCell>{(item.body_parts && item.body_parts.name_en) || item.body_part_id}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.urgency_default === 'urgent' ? 'bg-red-100 text-red-800' :
                                                    item.urgency_default === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {item.urgency_default}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteConcern(item.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="symptoms">
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Concern ID</TableHead>
                                    <TableHead>Red Flag</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {symptoms.filter(s => s.name_en.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                                        <TableCell>{item.name_en}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{item.concern_id}</TableCell>
                                        <TableCell>{item.is_red_flag ? '🔴' : ''}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => deleteSymptom(item.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="questions">
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Question (EN)</TableHead>
                                    <TableHead>Concern ID</TableHead>
                                    <TableHead>Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialQuestions.filter(q => q.question_en.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                                        <TableCell>{item.question_en}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{item.concern_id}</TableCell>
                                        <TableCell>{item.question_type}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function AddConcernDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Add Concern</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Concern</DialogTitle>
                </DialogHeader>
                <form action={createConcern} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label>ID (e.g. medical_head_pain)</Label>
                        <Input name="id" required placeholder="snake_case_id" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Parent Body Part ID</Label>
                        <Input name="body_part_id" required placeholder="medical_chest" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Name (English)</Label>
                        <Input name="name_en" required />
                    </div>
                    <div className="grid gap-2">
                        <Label>Name (Arabic)</Label>
                        <Input name="name_ar" required className="text-right" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Default Urgency</Label>
                        <Input name="urgency_default" placeholder="routine / moderate / urgent" />
                    </div>
                    <Button type="submit" className="w-full">Create Concern</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

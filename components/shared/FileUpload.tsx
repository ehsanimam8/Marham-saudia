'use client';

import { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    category: string;
}

export function FileUpload({
    patientId,
    appointmentId,
    onUploadComplete
}: {
    patientId: string;
    appointmentId: string;
    onUploadComplete: (files: UploadedFile[]) => void;
}) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        setUploading(true);
        const uploadedFiles: UploadedFile[] = [];

        for (const file of Array.from(e.target.files)) {
            // Validate file
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`الملف ${file.name} كبير جداً. الحد الأقصى 10 ميجابايت.`);
                continue;
            }

            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `medical-documents/${patientId}/${appointmentId}/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('medical-files')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                toast.error(`فشل رفع الملف ${file.name}`);
                continue;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('medical-files')
                .getPublicUrl(filePath);

            // Auto-detect category
            const category = detectCategory(file.name, file.type);

            // Save to medical_documents table
            const { data: doc, error: dbError } = await (supabase
                .from('medical_documents') as any)
                .insert({
                    patient_id: patientId,
                    document_type: category,
                    title: file.name,
                    file_url: publicUrl,
                    file_name: file.name,
                    file_size_bytes: file.size,
                    file_type: file.type,
                    uploaded_by: patientId,
                })
                .select()
                .single();

            if (!dbError && doc) {
                const newFile = {
                    id: doc.id,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: publicUrl,
                    category,
                };
                uploadedFiles.push(newFile);

                // Add to local state immediately so user sees progress
                setFiles(prev => [...prev, newFile]);
            } else {
                console.error("Database error", dbError);
                toast.error("حدث خطأ أثناء حفظ معلومات الملف");
            }
        }

        setUploading(false);
        if (uploadedFiles.length > 0) {
            toast.success("تم رفع الملفات بنجاح");
            // We trigger callback with cumulative files or just new ones? 
            // Spec says `onUploadComplete(uploadedFiles)`. 
            // If we want to persist ALL files in parent, we might pass all.
            // But let's pass the new ones, or better, pass the updated total list if parent manages ID list.
            // Actually the parent needs IDs.
            // Let's pass the single new batch, but usage depends on parent.
            // I will update the parent to just append IDs. 
            onUploadComplete(uploadedFiles);
        }
    }

    function detectCategory(fileName: string, fileType: string): string {
        const lower = fileName.toLowerCase();
        if (lower.includes('blood') || lower.includes('cbc') || lower.includes('lab') || lower.includes('تحليل')) return 'blood_test';
        if (lower.includes('xray') || lower.includes('x-ray') || lower.includes('أشعة')) return 'xray';
        if (lower.includes('ultrasound') || lower.includes('sono') || lower.includes('سونار')) return 'ultrasound';
        if (lower.includes('mri') || lower.includes('رنين')) return 'mri';
        if (lower.includes('prescription') || lower.includes('rx') || lower.includes('وصفة')) return 'prescription';
        if (fileType.startsWith('image/')) return 'report';
        return 'other';
    }

    function removeFile(id: string) {
        setFiles(files.filter(f => f.id !== id));
        // Ideally we should also delete from DB/Storage, but for now just UI removal from list
        // Parent should perform removal from its state too.
    }

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition
        ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-teal-50 border-teal-300 hover:bg-teal-100'}
      `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className={`w-10 h-10 mb-3 ${uploading ? 'text-gray-400' : 'text-teal-500'}`} />
                    <p className="mb-2 text-sm text-gray-700">
                        <span className="font-semibold">انقر لرفع الملفات</span> أو اسحب وأفلت هنا
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (حد أقصى 10 ميجابايت)</p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </label>

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">الملفات المرفوعة:</h4>
                    {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                {file.type.startsWith('image/') ? (
                                    <ImageIcon className="w-5 h-5 text-blue-500" />
                                ) : (
                                    <FileText className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.category}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(file.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {uploading && (
                <div className="text-center text-sm text-gray-600 animate-pulse">
                    جاري رفع الملفات...
                </div>
            )}
        </div>
    );
}

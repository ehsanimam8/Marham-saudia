import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateDoctor } from "@/app/actions/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Doctor {
    id: string;
    specialty: string;
    hospital: string;
    scfhs_license: string;
    consultation_price: number;
    experience_years: number;
    bio_ar: string;
    bio_en: string;
}

interface EditDoctorDialogProps {
    doctor: Doctor | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditDoctorDialog({
    doctor,
    open,
    onOpenChange,
}: EditDoctorDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        specialty: "",
        hospital: "",
        scfhs_license: "",
        consultation_price: "",
        experience_years: "",
        bio_ar: "",
        bio_en: "",
    });

    useEffect(() => {
        if (doctor) {
            setFormData({
                specialty: doctor.specialty || "",
                hospital: doctor.hospital || "",
                scfhs_license: doctor.scfhs_license || "",
                consultation_price: doctor.consultation_price?.toString() || "",
                experience_years: doctor.experience_years?.toString() || "",
                bio_ar: doctor.bio_ar || "",
                bio_en: doctor.bio_en || "",
            });
        }
    }, [doctor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!doctor) return;

        setLoading(true);
        try {
            await updateDoctor(doctor.id, {
                specialty: formData.specialty,
                hospital: formData.hospital,
                scfhs_license: formData.scfhs_license,
                consultation_price: parseFloat(formData.consultation_price),
                experience_years: parseInt(formData.experience_years),
                bio_ar: formData.bio_ar,
                bio_en: formData.bio_en,
            });
            toast.success("تم تحديث بيانات الطبيبة بنجاح");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء التحديث");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] text-right" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle>تعديل بيانات الطبيبة</DialogTitle>
                    <DialogDescription>
                        قم بتعديل المعلومات المهنية للطبيبة. اضغط حفظ عند الانتهاء.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>التخصص</Label>
                            <Input
                                value={formData.specialty}
                                onChange={(e) =>
                                    setFormData({ ...formData, specialty: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>المستشفى / العيادة</Label>
                            <Input
                                value={formData.hospital}
                                onChange={(e) =>
                                    setFormData({ ...formData, hospital: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>رخصة الهيئة</Label>
                            <Input
                                value={formData.scfhs_license}
                                onChange={(e) =>
                                    setFormData({ ...formData, scfhs_license: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>سعر الاستشارة (ريال)</Label>
                            <Input
                                type="number"
                                value={formData.consultation_price}
                                onChange={(e) =>
                                    setFormData({ ...formData, consultation_price: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>سنوات الخبرة</Label>
                        <Input
                            type="number"
                            value={formData.experience_years}
                            onChange={(e) =>
                                setFormData({ ...formData, experience_years: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>نبذة (عربي)</Label>
                        <Textarea
                            value={formData.bio_ar}
                            onChange={(e) =>
                                setFormData({ ...formData, bio_ar: e.target.value })
                            }
                            className="min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Bio (English)</Label>
                        <Textarea
                            value={formData.bio_en}
                            onChange={(e) =>
                                setFormData({ ...formData, bio_en: e.target.value })
                            }
                            className="min-h-[80px] text-left"
                            dir="ltr"
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            حفظ التغييرات
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

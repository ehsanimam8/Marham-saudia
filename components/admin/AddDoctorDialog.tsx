"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDoctor } from "@/app/actions/admin";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export default function AddDoctorDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        full_name_ar: "",
        full_name_en: "",
        city: "",
        specialty: "",
        hospital: "",
        scfhs_license: "",
        consultation_price: "",
        experience_years: "",
        bio_ar: "",
        bio_en: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createDoctor({
                ...formData,
                consultation_price: parseFloat(formData.consultation_price),
                experience_years: parseInt(formData.experience_years),
            });
            toast.success("تم إضافة الطبيبة بنجاح");
            setOpen(false);
            setFormData({
                email: "",
                password: "",
                full_name_ar: "",
                full_name_en: "",
                city: "",
                specialty: "",
                hospital: "",
                scfhs_license: "",
                consultation_price: "",
                experience_years: "",
                bio_ar: "",
                bio_en: "",
            });
        } catch (error: any) {
            console.error(error);
            toast.error("حدث خطأ أثناء الإضافة");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة طبيبة
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] text-right" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle>إضافة طبيبة جديدة</DialogTitle>
                    <DialogDescription>
                        أدخل بيانات الطبيبة الجديدة. سيتم إنشاء ملف شخصي تلقائيًا.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>البريد الإلكتروني</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>كلمة المرور</Label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>الاسم الكامل (عربي)</Label>
                            <Input
                                value={formData.full_name_ar}
                                onChange={(e) =>
                                    setFormData({ ...formData, full_name_ar: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Full Name (English)</Label>
                            <Input
                                value={formData.full_name_en}
                                onChange={(e) =>
                                    setFormData({ ...formData, full_name_en: e.target.value })
                                }
                                dir="ltr"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>المدينة</Label>
                            <Input
                                value={formData.city}
                                onChange={(e) =>
                                    setFormData({ ...formData, city: e.target.value })
                                }
                                required
                            />
                        </div>
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>المستشفى</Label>
                            <Input
                                value={formData.hospital}
                                onChange={(e) =>
                                    setFormData({ ...formData, hospital: e.target.value })
                                }
                                required
                            />
                        </div>
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-2">
                        <Label>نبذة (عربي)</Label>
                        <Textarea
                            value={formData.bio_ar}
                            onChange={(e) =>
                                setFormData({ ...formData, bio_ar: e.target.value })
                            }
                            className="min-h-[60px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Bio (English)</Label>
                        <Textarea
                            value={formData.bio_en}
                            onChange={(e) =>
                                setFormData({ ...formData, bio_en: e.target.value })
                            }
                            className="min-h-[60px] text-left"
                            dir="ltr"
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            إضافة
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

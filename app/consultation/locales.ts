export const translations = {
    ar: {
        // Shared
        loading: 'جاري التحميل...',
        submit: 'إرسال',
        continue: 'متابعة',
        cancel: 'إلغاء',
        error: 'حدث خطأ',
        success: 'تمت العملية بنجاح',

        // Pre-Consultation
        preConsultationTitle: 'معلومات ما قبل الاستشارة',
        preConsultationDesc: 'يرجى تقديم بعض التفاصيل قبل الاستشارة لمساعدة الطبيب.',
        currentSymptoms: 'الأعراض الحالية',
        symptomsPlaceholder: 'صف ما تشعر به...',
        duration: 'كم هي مدة هذه الأعراض؟',
        durationPlaceholder: 'مثلا: يومين، أسبوع',
        severity: 'مستوى الشدة',
        mild: 'خفيف',
        moderate: 'متوسط',
        severe: 'شديد',
        medications: 'الأدوية الحالية (اختياري)',
        medicationsPlaceholder: 'اذكر أي أدوية تتناولها',
        allergies: 'الحساسية (اختياري)',
        allergiesPlaceholder: 'اذكر أي حساسية معروفة',
        upload: 'رفع ملفات / تقارير (اختياري)',
        uploadBtn: 'رفع ملف',
        continueBtn: 'المتابعة إلى غرفة الانتظار',

        // Waiting Room
        waitingTitle: 'غرفة الانتظار',
        waitingDesc: 'ستبدأ استشارتك قريباً.',
        estimatedWait: 'وقت الانتظار المتوقع',
        minutes: 'دقيقة',
        queuePosition: 'دورك في الانتظار',
        systemCheck: 'فحص النظام',
        camera: 'الكاميرا متصلة',
        mic: 'الميكروفون يعمل',
        internet: 'الإنترنت مستقر',
        keepOpen: 'يرجى إبقاء هذه النافذة مفتوحة. سيتم تحويلك تلقائياً عند انضمام الطبيب.',
        doctorJoined: 'انضم الطبيب! جاري التحويل...',
        completePreConsultFirst: 'يرجى إكمال بيانات ما قبل الاستشارة أولاً',

        // Video Room
        leaveConfirm: 'هل أنت متأكد من رغبتك في مغادرة الاستشارة؟',
        connecting: 'جاري الاتصال بالغرفة الآمنة...',

        // Thank You
        consultationCompleted: 'اكتملت الاستشارة',
        thankYouMessage: 'شكراً لاستخدامك مرهم السعودية.',
        checkEmail: 'تفقد بريدك الإلكتروني',
        emailNote: 'تم إرسال الوصفة الطبية وملاحظات الاستشارة إلى بريدك الإلكتروني المسجل.',
        rateExperience: 'كيف كانت تجربتك؟',
        feedbackPlaceholder: 'شاركنا أي ملاحظات إضافية (اختياري)...',
        submitFeedback: 'إرسال التقييم',
        feedbackSuccess: 'شكراً لملاحظاتك!',
        feedbackSubmitted: 'تم إرسال تقييمك بنجاح.',
        backToDashboard: 'العودة للرئيسية',
    },
    en: {
        // Shared
        loading: 'Loading...',
        submit: 'Submit',
        continue: 'Continue',
        cancel: 'Cancel',
        error: 'Error occurred',
        success: 'Operation successful',

        // Pre-Consultation
        preConsultationTitle: 'Pre-Consultation Information',
        preConsultationDesc: 'Please provide some details before your consultation to help the doctor prepare.',
        currentSymptoms: 'Current Symptoms',
        symptomsPlaceholder: 'Describe what you are feeling...',
        duration: 'How long have you had these symptoms?',
        durationPlaceholder: 'e.g., 2 days, 1 week',
        severity: 'Severity Level',
        mild: 'Mild',
        moderate: 'Moderate',
        severe: 'Severe',
        medications: 'Current Medications (Optional)',
        medicationsPlaceholder: 'List any medications you are taking',
        allergies: 'Allergies (Optional)',
        allergiesPlaceholder: 'List any known allergies',
        upload: 'Reports / Images (Optional)',
        uploadBtn: 'Upload File',
        continueBtn: 'Continue to Waiting Room',

        // Waiting Room
        waitingTitle: 'Waiting Room',
        waitingDesc: 'Your consultation will start shortly.',
        estimatedWait: 'Estimated Wait',
        minutes: 'mins',
        queuePosition: 'Queue Position',
        systemCheck: 'System Check',
        camera: 'Camera connected',
        mic: 'Microphone active',
        internet: 'Internet stable',
        keepOpen: 'Please keep this window open. You will be automatically redirected when the doctor joins.',
        doctorJoined: 'Doctor has started the consultation!',
        completePreConsultFirst: 'Please complete pre-consultation information first',

        // Video Room
        leaveConfirm: 'Are you sure you want to leave the consultation?',
        connecting: 'Connecting to secure room...',

        // Thank You
        consultationCompleted: 'Consultation Completed',
        thankYouMessage: 'Thank you for using Marham Saudi.',
        checkEmail: 'Check your Inbox',
        emailNote: 'Your prescription and consultation notes have been sent to your registered email address.',
        rateExperience: 'How was your experience?',
        feedbackPlaceholder: 'Share any additional feedback (optional)...',
        submitFeedback: 'Submit Feedback',
        feedbackSuccess: 'Thank you for your feedback!',
        feedbackSubmitted: 'Your feedback has been submitted successfully.',
        backToDashboard: 'Back to Dashboard',
    }
};

export type Language = 'ar' | 'en';

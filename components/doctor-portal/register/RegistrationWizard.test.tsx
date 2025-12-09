
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationWizard from './RegistrationWizard';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock server action
vi.mock('@/app/actions/auth', () => ({
    registerDoctor: vi.fn(),
}));

// Mock Sonner toast
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    }
}));

// Mock FileUpload or other specific components if needed, but Step3 uses simple input for now (or a disabled check).
// Since Step3 validation is re-enabled, we might need to simulate file upload.
// However, the test environment might struggle with actual file inputs unless we simulate it well.
// Let's verify Step 3 by passing a dummy file.

import { registerDoctor } from '@/app/actions/auth';

// Mock UI Select to avoid Radix UI pointer event issues in test
vi.mock('@/components/ui/select', () => {
    const MockSelect = ({ onValueChange, children }: any) => {
        return <div data-testid="mock-select" onClick={(e: any) => {
            // Basic delegation to children if needed, but simpler to just mock the parts
            // We can attach the onValueChange handler to the dataset of the root or something
            // but easier is to use a context-like pattern if we were writing a full mock.
            // For this test, let's just expose a way to trigger value change or make Items clickable.
            // We'll attach onValueChange to the children by cloning? No, too complex.
            // We will try to find the items and click them.
        }} data-on-value-change={onValueChange}>{children}</div>;
    };
    return {
        Select: ({ onValueChange, children }: any) => <div data-testid="select-root"><MockSelectContext.Provider value={onValueChange}>{children}</MockSelectContext.Provider></div>,
        SelectTrigger: ({ children, onClick }: any) => <button role="combobox" onClick={onClick}>{children}</button>,
        SelectContent: ({ children }: any) => <div role="listbox">{children}</div>,
        SelectItem: ({ value, children }: any) => {
            const onValueChange = React.useContext(MockSelectContext);
            return (
                <div
                    role="option"
                    onClick={() => onValueChange && onValueChange(value)}
                    data-value={value}
                >
                    {children}
                </div>
            );
        },
        SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    };
});

import React from 'react';
const MockSelectContext = React.createContext<(value: string) => void>(() => { });

// Helper to fill Step 1
async function fillStep1(user: any) {
    const nextButtons = screen.getAllByRole('button', { name: /التالي/i });
    const nextButton = nextButtons[0]; // Assuming the visible one is first or finding by context

    await user.type(screen.getByLabelText(/الاسم الأول/i), 'Dr. Test');
    await user.type(screen.getByLabelText(/اسم العائلة/i), 'User');
    await user.type(screen.getByLabelText(/البريد الإلكتروني/i), 'test@example.com');
    await user.type(screen.getByLabelText(/رقم الجوال/i), '0500000000');
    await user.type(screen.getByLabelText(/كلمة المرور/i), 'password123');

    await user.click(nextButton);
}

describe('RegistrationWizard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (registerDoctor as any).mockResolvedValue({ error: null });
    });

    test('completes full registration flow successfully', async () => {
        const user = userEvent.setup();
        render(<RegistrationWizard />);

        // --- STEP 1 ---
        expect(screen.getByRole('heading', { name: 'المعلومات الأساسية' })).toBeInTheDocument();

        // Fill Step 1
        await fillStep1(user);

        // --- STEP 2 ---
        expect(await screen.findByRole('heading', { name: 'المعلومات المهنية' })).toBeInTheDocument();

        // Select requires opening the dropdown
        // Trigger ID is generic, but placeholder is "اختر التخصص"
        const selectTrigger = screen.getByRole('combobox');
        await user.click(selectTrigger);

        const option = await screen.findByText('أمراض النساء والولادة');
        await user.click(option);

        await user.type(screen.getByLabelText(/رقم الترخيص/i), '12345678');
        await user.type(screen.getByLabelText(/المستشفى/i), 'Test Hospital');
        await user.type(screen.getByRole('textbox', { name: /نبذة تعريفية/i }), 'Test Bio'); // Textarea

        // Click Next on Step 2
        // There are now multiple buttons, we need the visible "Next" button.
        // The previous step's button is removed from DOM, so getByRole should work if unique, 
        // but in a wizard, previous steps are conditional.
        await user.click(screen.getByRole('button', { name: /التالي/i }));

        // --- STEP 3 ---
        expect(await screen.findByRole('heading', { name: 'المستندات المطلوبة' })).toBeInTheDocument();

        // Upload a file
        // Step3Documents.tsx has input type="file"
        const file = new File(['dummy content'], 'license.pdf', { type: 'application/pdf' });
        // const input = screen.getByLabelText(/اضغط لرفع الملفات/i) as HTMLInputElement;
        // Alternatively find by selector if label doesn't link perfectly
        // The label wraps the input in the component: <div onClick...> <input ... /> </div>
        // The input is hidden. We need to find it directly.
        // Changing approach to locate hidden input
        // In happy-dom/jsdom hidden inputs are hard to target by label sometimes if the label has nested elements clicking logic.
        // The most robust way for hidden file input in testing library is often accessing the container or ID.
        // Step3Documents.tsx doesn't have an ID on the input but it has ref.
        // It is <input type="file" ... className="hidden" />
        // We can use container.querySelector
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            await user.upload(fileInput as HTMLInputElement, file);
        } else {
            throw new Error('File input not found');
        }

        // Check if file is listed
        expect(await screen.findByText('license.pdf')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /التالي/i }));

        // --- STEP 4 ---
        expect(await screen.findByRole('heading', { name: 'مراجعة الطلب' })).toBeInTheDocument();

        // Submit
        const submitButton = screen.getByRole('button', { name: /إرسال الطلب/i });
        await user.click(submitButton);

        // --- SUCCESS ---
        expect(await screen.findByRole('heading', { name: 'تم استلام طلب التسجيل بنجاح!' })).toBeInTheDocument();

        // Verify server action was called
        expect(registerDoctor).toHaveBeenCalled();
    });
});


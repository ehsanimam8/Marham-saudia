
import { Suspense } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import WaitingRoomPage from '@/app/consultation/[id]/waiting-room/page'; // Adjust path if needed


// Mock global navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useParams: () => ({ id: '123' }),
}));

// Mock React 'use' to avoid suspension
vi.mock('react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react')>();
    return {
        ...actual,
        use: (promise: any) => promise,
    };
});

// Hoist mocks to ensure availability in factory
const mocks = vi.hoisted(() => ({
    from: vi.fn(),
    channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
        from: mocks.from,
        channel: mocks.channel,
        removeChannel: mocks.removeChannel,
    }),
}));

// Basic mock for LanguageProvider context
vi.mock('@/app/consultation/LanguageProvider', () => ({
    ConsultationLanguageProvider: ({ children }: any) => <div>{children}</div>,
    useConsultationLanguage: () => ({
        t: {
            waitingTitle: 'Waiting Room',
            waitingDesc: 'Wait here',
            doctorJoined: 'Doctor Joined',
            completePreConsultFirst: 'Complete Pre-Consult First'
        }
    })
}));

// Mock Toast
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    }
}));

// Helper to mock Supabase response
const mockAppointmentResponse = (data: any, error: any = null) => {
    mocks.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data, error })
            })
        })
    });
};

const originalConsoleError = console.error;
beforeEach(() => {
    console.error = vi.fn((...args) => {
        originalConsoleError(...args); // Keep printing to stdout so we see it
    });
});

afterEach(() => {
    console.error = originalConsoleError;
});

describe('Waiting Room Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // We need to export/import the Content component directly usually, or wrap the Page.
    // Since WaitingRoomPage is default export, we try rendering it.
    // Note: WaitingRoomPage uses `use(params)`, which we mocked.

    it('should redirect to pre-consultation if not completed', async () => {
        mockAppointmentResponse({
            id: '123',
            status: 'scheduled',
            pre_consultation_completed: false,
            doctor: {
                profile_photo_url: 'http://foo.com/img.jpg',
                profile: { full_name_en: 'Dr. House', full_name_ar: 'د. هاوس' }
            }
        });

        const params = { id: '123' } as any;

        render(
            <Suspense fallback={<div>Loading...</div>}>
                <WaitingRoomPage params={params} />
            </Suspense>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(mockPush).toHaveBeenCalledWith('/consultation/123/pre-consultation');
        });
    });

    it('should stay in waiting room if pre-consultation is completed', async () => {
        mockAppointmentResponse({
            id: '123',
            status: 'scheduled',
            pre_consultation_completed: true,
            doctor: {
                profile_photo_url: 'http://foo.com/img.jpg',
                profile: { full_name_en: 'Dr. House', full_name_ar: 'د. هاوس' }
            }
        });

        const params = { id: '123' } as any;

        render(
            <Suspense fallback={<div>Loading...</div>}>
                <WaitingRoomPage params={params} />
            </Suspense>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(screen.getByText('Waiting Room')).toBeInTheDocument();
        });

        expect(mockPush).not.toHaveBeenCalled();
    });

    it('should redirect to room if status is in_progress', async () => {
        mockAppointmentResponse({
            id: '123',
            status: 'in_progress',
            pre_consultation_completed: true,
            doctor: {
                profile_photo_url: 'http://foo.com/img.jpg',
                profile: { full_name_en: 'Dr. House', full_name_ar: 'د. هاوس' }
            }
        });

        const params = { id: '123' } as any;

        render(
            <Suspense fallback={<div>Loading...</div>}>
                <WaitingRoomPage params={params} />
            </Suspense>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(mockPush).toHaveBeenCalledWith('/consultation/123/room');
        });
    });
});

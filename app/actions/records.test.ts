
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPatientRecords } from './records';

// Mock Dependencies
const mockFrom = vi.fn();
const mockGetUser = vi.fn();
const mockStorageFrom = vi.fn();

const mockSupabase = {
    from: mockFrom,
    auth: {
        getUser: mockGetUser
    },
    storage: {
        from: mockStorageFrom
    }
};

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => Promise.resolve(mockSupabase))
}));

vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mockSupabase)
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}));

describe('getPatientRecords', () => {
    let queryBuilder: any;
    let storageBuilder: any;

    beforeEach(() => {
        vi.clearAllMocks();

        queryBuilder = {
            select: vi.fn(),
            eq: vi.fn(),
            single: vi.fn(),
        };

        // Default Chain
        queryBuilder.select.mockReturnValue(queryBuilder);
        queryBuilder.eq.mockReturnValue(queryBuilder);
        queryBuilder.single.mockReturnValue(queryBuilder);

        storageBuilder = {
            createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'mock-signed-url' } }),
            getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'mock-public-url' } }),
            upload: vi.fn().mockResolvedValue({ error: null })
        };
        mockStorageFrom.mockReturnValue(storageBuilder);
    });

    it('should return empty array if no user', async () => {
        mockGetUser.mockResolvedValue({ data: { user: null } });
        const result = await getPatientRecords();
        expect(result).toEqual([]);
    });

    it('should fetch and merge records correctly', async () => {
        const mockUser = { id: 'user123' };
        mockGetUser.mockResolvedValue({ data: { user: mockUser } });

        const legacyRecords = [
            { id: 'leg1', file_name: 'old.pdf', description: 'Old Record', record_type: 'report', created_at: '2023-01-01', file_path: 'path/old.pdf' }
        ];
        const newDocs = [
            { id: 'new1', document_name: 'new.pdf', document_type: 'report', uploaded_at: '2023-02-01', document_url: 'http://public.url' }
        ];

        mockFrom.mockImplementation((table) => {
            // Create a dedicated builder for this call
            const builder: any = {
                select: vi.fn(),
                eq: vi.fn(),
                single: vi.fn(),
                order: vi.fn() // Add order if used
            };

            // Default return self for chaining
            builder.select.mockReturnValue(builder);
            builder.eq.mockReturnValue(builder);
            builder.single.mockReturnValue(builder);
            builder.order.mockReturnValue(builder);

            if (table === 'patients') {
                // Final result for patients chain
                builder.single.mockResolvedValue({ data: { id: 'patientUUID' } });
            }
            else if (table === 'patient_records') {
                // Final result for patient_records (select -> eq)
                // Note: code awaits the result of the chain. 
                // The chain is: supabase.from().select().eq() -> Promise-like
                // So eq() must return a then-able or we mock the promise output on the last called method?
                // Actually supabase methods return a PostgrestBuilder which is thenable.
                // In my code: await (supabase from...) .select() .eq()
                // So the return value of eq() is what is awaited.

                builder.eq.mockResolvedValue({ data: legacyRecords });
            }
            else if (table === 'medical_documents') {
                builder.eq.mockResolvedValue({ data: newDocs });
            }

            return builder;
        });

        const result = await getPatientRecords();

        expect(result).toHaveLength(2);

        // Sort check: new1 is Feb, leg1 is Jan. So new1 should be first.
        expect(result[0].id).toBe('new1');
        expect(result[0].source).toBe('medical_documents');
        expect(result[0].name).toBe('new'); // Cleaned name

        expect(result[1].id).toBe('leg1');
        expect(result[1].source).toBe('dashboard');
        expect(result[1].name).toBe('Old Record'); // Description priority

        // Signed URL check
        expect(mockStorageFrom).toHaveBeenCalledWith('patient_records');
        expect(storageBuilder.createSignedUrl).toHaveBeenCalledWith('path/old.pdf', 3600);
        expect(result[1].url).toBe('mock-signed-url');
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOnboardingCategories, getBodyParts, getConcernDetails, createOnboardingSession } from './onboarding_v5';

// Mock the dependencies
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockGetUser = vi.fn();

const mockSupabase = {
    from: mockFrom,
    auth: {
        getUser: mockGetUser
    },
    // storage: {} // Add if needed
};

// Start building the chain
// from() returns a builder
// from().select() returns a builder
// from().select().eq() returns a builder
// etc.

// A helper to reset the chain mocks
function resetChain() {
    // Default chain for a simple select query: from -> select -> order -> Promise
    // But we need to support different chains.
    // simpler approach: always return "this" or a mock that has all methods

    const queryBuilder: any = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        then: (resolve: any) => resolve({ data: [], error: null }) // Default promise resolution
    };

    mockFrom.mockReturnValue(queryBuilder);
    mockSelect.mockReturnValue(queryBuilder);
    // ...
    return queryBuilder;
}

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => Promise.resolve(mockSupabase))
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}));

describe('onboarding_v5 actions', () => {
    let queryBuilder: any;

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup a generic chain mock
        queryBuilder = {
            select: vi.fn(),
            insert: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            eq: vi.fn(),
            order: vi.fn(),
            single: vi.fn(),
        };

        // Allow chaining
        queryBuilder.select.mockReturnValue(queryBuilder);
        queryBuilder.insert.mockReturnValue(queryBuilder);
        queryBuilder.update.mockReturnValue(queryBuilder);
        queryBuilder.delete.mockReturnValue(queryBuilder);
        queryBuilder.eq.mockReturnValue(queryBuilder);
        queryBuilder.order.mockReturnValue(queryBuilder);
        queryBuilder.single.mockReturnValue(queryBuilder);

        mockFrom.mockReturnValue(queryBuilder);
    });

    describe('getOnboardingCategories', () => {
        it('should fetch categories ordered by display_order', async () => {
            const mockData = [{ id: 1, name: 'Cat 1' }];
            // Mock the final promise resolution of the chain
            queryBuilder.order.mockResolvedValue({ data: mockData, error: null });

            const result = await getOnboardingCategories();

            expect(mockFrom).toHaveBeenCalledWith('onboarding_categories');
            expect(queryBuilder.select).toHaveBeenCalledWith('*');
            expect(queryBuilder.order).toHaveBeenCalledWith('display_order');
            expect(result).toEqual(mockData);
        });

        it('should return empty array on failure or null data', async () => {
            queryBuilder.order.mockResolvedValue({ data: null, error: { message: 'Error' } });
            const result = await getOnboardingCategories();
            expect(result).toEqual([]);
        });
    });

    describe('getBodyParts', () => {
        it('should fetch body parts and map them correctly', async () => {
            const mockDbData = [{
                id: 'bp1',
                name_ar: 'Ar',
                name_en: 'En',
                category_id: 'cat1',
                requires_age_check: true
            }];

            const expectedData = [{
                id: 'bp1',
                nameAr: 'Ar',
                nameEn: 'En',
                svgPath: '',
                concerns: [],
                requiresAgeCheck: true,
                estimatedQuestions: 5,
                categories: ['cat1']
            }];

            // getBodyParts calls from -> select -> order -> then...
            // or from -> select -> order -> eq -> then... if categoryId is provided

            // Check if categoryId is NOT provided
            queryBuilder.order.mockResolvedValue({ data: mockDbData });

            const result = await getBodyParts();
            expect(mockFrom).toHaveBeenCalledWith('body_parts');
            expect(result).toEqual(expectedData);
        });

        it('should filter by categoryId if provided', async () => {
            const mockDbData = [{
                id: 'bp1',
                name_ar: 'Ar',
                name_en: 'En',
                category_id: 'cat1',
                requires_age_check: true
            }];

            // when filtering: from -> select -> order -> eq -> Promise
            queryBuilder.eq.mockResolvedValue({ data: mockDbData });

            const result = await getBodyParts('cat1');

            expect(queryBuilder.eq).toHaveBeenCalledWith('category_id', 'cat1');
            expect(result).toHaveLength(1);
        });
    });

    describe('createOnboardingSession', () => {
        it('should create a session for a guest user', async () => {
            // Mock getUser to return no user
            mockGetUser.mockResolvedValue({ data: { user: null } });

            const mockSessionData = { id: 'session123', session_token: 'abc' };
            queryBuilder.single.mockResolvedValue({ data: mockSessionData, error: null });

            const result = await createOnboardingSession('bp1');

            expect(mockGetUser).toHaveBeenCalled();
            expect(mockFrom).toHaveBeenCalledWith('onboarding_sessions');
            expect(queryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
                body_part: 'bp1',
                patient_id: null,
                // session_token should be present
            }));
            expect(result).toEqual(mockSessionData);
        });

        it('should create a session for a logged in user', async () => {
            mockGetUser.mockResolvedValue({ data: { user: { id: 'user1' } } });

            const mockSessionData = { id: 'session123', patient_id: 'user1' };
            queryBuilder.single.mockResolvedValue({ data: mockSessionData, error: null });

            const result = await createOnboardingSession('bp1');

            expect(queryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
                patient_id: 'user1',
                session_token: null
            }));
        });
    });
});

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthDebugPage() {
    const router = useRouter();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const testLogin = async () => {
        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('email', 'test@example.com');
            formData.append('password', 'test123456');
            formData.append('next', '/');

            const response = await fetch('/api/test-auth', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setResult(data);

            if (data.success) {
                console.log('✅ Login successful, redirecting to:', data.redirectTo);
                router.push(data.redirectTo);
            }
        } catch (error: any) {
            setResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>

                <div className="space-y-4">
                    <button
                        onClick={testLogin}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Testing...' : 'Test Login'}
                    </button>

                    {result && (
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                            <h2 className="font-bold mb-2">Result:</h2>
                            <pre className="text-sm overflow-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <h3 className="font-bold mb-2">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Make sure you have a test user created</li>
                        <li>Email confirmation should be disabled in Supabase</li>
                        <li>Click "Test Login" to see the response</li>
                        <li>Check browser console for any errors</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

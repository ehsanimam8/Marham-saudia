import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({ request: { headers: request.headers } });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({ request: { headers: request.headers } });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // Public routes (no auth required)
    const publicRoutes = ['/', '/doctors', '/health', '/about', '/contact', '/how-it-works', '/articles', '/onboarding'];
    // Also static assets usually handled by config, but good to be safe if manual check
    const authRoutes = ['/login', '/register', '/doctor-portal/login', '/doctor-portal/register', '/admin/login'];

    const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'));
    const isAuthRoute = authRoutes.includes(path);

    // Exclude explicit next/static (handled by matcher but ensuring no issues)
    // Logic below handles redirections.

    // Not logged in - redirect to appropriate login
    if (!user && !isPublicRoute && !isAuthRoute) {
        if (path.startsWith('/api')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (path.startsWith('/doctor-portal')) {
            return NextResponse.redirect(new URL('/doctor-portal/login', request.url));
        }
        if (path.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Logged in - verify accessing correct portal
    if (user && !isPublicRoute) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role;

        // Doctor accessing wrong portal
        if (role === 'doctor') {
            if (!path.startsWith('/doctor-portal') && !path.startsWith('/consultation') && !path.startsWith('/api')) {
                return NextResponse.redirect(new URL('/doctor-portal', request.url));
            }
        }

        // Patient accessing wrong portal
        if (role === 'patient' || !role) {
            if (path.startsWith('/doctor-portal') || path.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }

        // Admin accessing wrong portal
        if (role === 'admin') {
            if (!path.startsWith('/admin') && !path.startsWith('/consultation') && !path.startsWith('/api')) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }

        // Logged in user on auth pages - redirect to dashboard
        if (isAuthRoute) {
            if (role === 'doctor') return NextResponse.redirect(new URL('/doctor-portal', request.url));
            if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

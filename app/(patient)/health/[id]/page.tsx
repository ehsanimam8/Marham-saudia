import { redirect } from 'next/navigation';

export default function ArticlePage() {
    // For MVP, we don't have individual article pages yet.
    // Redirect to the main health library page.
    redirect('/health');
}

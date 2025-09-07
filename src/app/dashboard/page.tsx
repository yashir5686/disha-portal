
import AppLayout from "@/components/layout/AppLayout";

export default function DashboardRedirect() {
    // This component can be expanded later if a dedicated /dashboard page is needed.
    // For now, we are using src/app/page.tsx as the main dashboard.
    return (
        <AppLayout>
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
                    <p className="text-muted-foreground">This is the dashboard page.</p>
                </div>
            </main>
        </AppLayout>
    )
}

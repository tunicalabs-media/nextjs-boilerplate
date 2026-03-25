import { Card, CardContent } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="bg-muted h-8 w-48 animate-pulse rounded-md" />
        <div className="bg-muted mt-2 h-5 w-96 animate-pulse rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 pt-6">
              <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

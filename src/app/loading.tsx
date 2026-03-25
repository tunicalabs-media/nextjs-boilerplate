import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-24">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <div className="border-muted border-t-primary h-8 w-8 animate-spin rounded-full border-4" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}

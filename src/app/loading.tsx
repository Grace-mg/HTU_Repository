export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span>Loading repository resource...</span>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="text-muted-foreground container mx-auto px-4 text-center text-sm sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} Next.js Boilerplate. Built with
          Next.js, Tailwind CSS &amp; shadcn/ui.
        </p>
      </div>
    </footer>
  );
}

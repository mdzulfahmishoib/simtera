export default function Footer() {
  return (
    <footer className="border-t py-4 px-4 bg-muted/30 text-center">
      <div className="container mx-auto">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} SIMTERA - Simulasi & Test Edukasi Berkendara
        </p>
      </div>
    </footer>
  );
}
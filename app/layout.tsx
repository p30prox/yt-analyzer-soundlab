export const metadata = {
  title: 'YT Analyzer Pro — Sound Lab',
  description: 'Enhance tone, dynamics & loudness langsung di browser',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}

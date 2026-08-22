import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'CortaAI - Vídeos longos em cortes virais',
  description: 'Transforme vídeos longos em cortes virais com IA. Legendas automáticas, edição rápida.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased bg-[#0A0A0A] text-white min-h-screen">
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  )
}

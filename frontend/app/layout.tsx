import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'S402 Agent Registry',
  description: 'Interact with autonomous agents on Somnia Testnet',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

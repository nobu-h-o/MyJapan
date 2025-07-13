import './styles/global.css';
import type { Metadata} from 'next';

export const metadata: Metadata = {
  title: 'MyJapan',
  description: 'Make a Personalized Travel Plan by Answering 6 Questions!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/sakura-js@1.1.1/dist/sakura.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
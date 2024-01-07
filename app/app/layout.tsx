import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.css';
import { Roboto } from 'next/font/google';
import Image from 'next/image';
import logo from './zKubeLogo.svg';
import { AccountProvider } from './providers/AccountProvider';
import { ConnectButton } from './ConnectButton';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'zKubes',
  description: 'Zero-Knowledge Cube Composer game.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AccountProvider>
        <body className={roboto.className}>
          <header className={styles.header}>
            <Image src={logo} alt="logo" className={styles.logo} />
            <div className={styles.connectButton}>
              <ConnectButton />
            </div>
          </header>
          {children}
        </body>
      </AccountProvider>
    </html>
  );
}

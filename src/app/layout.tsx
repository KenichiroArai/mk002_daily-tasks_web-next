import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { siteConfig } from '@/config/site';
import { SUMMARY_PATH as ADVANCE_SUMMARY_PATH } from '@/dailyTasks/advance';
import { SUMMARY_PATH as CARRYOVER_SUMMARY_PATH } from '@/dailyTasks/carryover';
import { Footer, Header, PageContainer, type FooterLink } from '@/shared/components/layout';
import { assetPath } from '@/shared/lib';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: `${siteConfig.title} | ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const footerLinks: FooterLink[] = [
    { label: `${siteConfig.repositoryName} の Issue`, href: siteConfig.issuesUrl },
    { label: '持ち越し summary.json', href: assetPath(CARRYOVER_SUMMARY_PATH) },
    { label: '先行 summary.json', href: assetPath(ADVANCE_SUMMARY_PATH) },
  ];

  return (
    <html lang="ja">
      <body>
        <Header title={siteConfig.title} description={siteConfig.description} />
        <PageContainer>{children}</PageContainer>
        <Footer prefix="データ:" links={footerLinks} />
      </body>
    </html>
  );
}
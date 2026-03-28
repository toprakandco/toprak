import { WebpackChunkRecovery } from '@/components/WebpackChunkRecovery';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <WebpackChunkRecovery />
      {children}
    </>
  );
}

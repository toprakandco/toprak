import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function AdminLoginLayout({ children }: Props) {
  return <>{children}</>;
}

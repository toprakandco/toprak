import { getUnreadContactsCount } from '@/lib/admin-unread-contacts';
import { normalizeAdminLoginId, adminDisplayName } from '@/lib/admin-users';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { AdminShell } from './AdminShell';

export const dynamic = 'force-dynamic';

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const unreadContacts = await getUnreadContactsCount();
  const cookieStore = await cookies();
  const rawUser = cookieStore.get('admin_user')?.value ?? '';
  const loginId = normalizeAdminLoginId(rawUser);
  const adminDisplay = loginId ? adminDisplayName(loginId) : null;

  return (
    <AdminShell unreadContacts={unreadContacts} adminDisplay={adminDisplay}>
      {children}
    </AdminShell>
  );
}

/** İzin verilen yönetim paneli kullanıcı adları (küçük harf). */
export const ADMIN_LOGIN_IDS = ['eymen', 'ece'] as const;

export type AdminLoginId = (typeof ADMIN_LOGIN_IDS)[number];

export function normalizeAdminLoginId(raw: string): AdminLoginId | null {
  const s = raw.trim().toLowerCase();
  return (ADMIN_LOGIN_IDS as readonly string[]).includes(s)
    ? (s as AdminLoginId)
    : null;
}

export function adminDisplayName(id: AdminLoginId): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

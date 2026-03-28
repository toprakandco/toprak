export function getAdminPageTitle(pathname: string): string {
  if (pathname.startsWith('/admin/blog/edit')) return 'Blog yazısı düzenle';
  if (pathname.startsWith('/admin/blog/new')) return 'Yeni blog yazısı';
  if (pathname.startsWith('/admin/blog')) return 'Blog';
  if (pathname.startsWith('/admin/portfolio/edit')) return 'Portfolyo düzenle';
  if (pathname.startsWith('/admin/portfolio/new')) return 'Yeni portfolyo';
  if (pathname.startsWith('/admin/portfolio')) return 'Portfolyo';
  if (pathname.startsWith('/admin/applications')) return 'Proje Başvuruları';
  if (pathname.startsWith('/admin/contacts')) return 'İletişim';
  if (pathname.startsWith('/admin/clients')) return 'Müşteriler';
  if (pathname.startsWith('/admin/settings')) return 'Ayarlar';
  if (pathname === '/admin' || pathname === '/admin/') return 'Genel Bakış';
  return 'Yönetim';
}

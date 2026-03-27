import { AdminLoginForm } from './AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F0E6] px-5 py-10">
      <div className="w-full max-w-[400px] rounded-2xl bg-white px-10 py-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <p className="text-center font-serif text-2xl tracking-wide text-[#8B3A1E]">
          TOPRAK &amp; Co.
        </p>
        <h1 className="mt-3 text-center font-sans text-sm font-normal text-[#6B4C35]">
          Yönetim Paneli
        </h1>

        <AdminLoginForm />
      </div>
    </div>
  );
}

import { AdminGuard } from "@/components/auth/AdminGuard";

/**
 * Todo lo que cuelga de `/admin/*` comparte el shell de `app/(dashboard)/layout.tsx`
 * y exige rol ADMIN.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}

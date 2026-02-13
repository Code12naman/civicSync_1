'use client';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <section className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">
                Welcome, {user?.email}
              </h1>
              <p className="mt-4 text-gray-700 text-lg">Track reported issues, monitor statuses, and view insights — all in one place.</p>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-[#eaf7f1] p-4 md:p-6 shadow">
                <img src="/aaca8ac102255c3e3dae66d58fb09b84.jpg" alt="City workers and infrastructure illustration" width={720} height={720} className="rounded-2xl object-cover" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
"use client";

import '../globals.css';
import { Navbar } from '@/components/shared/navbar';
import { ListChecks, Users, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <></>, isActive: pathname === '/admin/dashboard' },
    { href: '/admin/issues', label: 'Issues', icon: <ListChecks className="h-4 w-4" />, isActive: pathname === '/admin/issues' },
    { href: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" />, isActive: pathname === '/admin/users' },
    { href: '/admin/map', label: 'Map', icon: <MapPin className="h-4 w-4" />, isActive: pathname === '/admin/map' },
  ];

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <Navbar navItems={adminNavItems} userType="Admin" />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

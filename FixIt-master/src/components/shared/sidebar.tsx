"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ListChecks, User, MapPin, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname() || '/admin/dashboard';
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const items = [
    { id: 'dashboard', href: '/admin/dashboard', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'issues', href: '/admin/issues', label: 'Issues', icon: <ListChecks className="h-5 w-5" /> },
    { id: 'users', href: '/admin/users', label: 'Users', icon: <User className="h-5 w-5" /> },
    { id: 'map', href: '/admin/map', label: 'Map', icon: <MapPin className="h-5 w-5" /> },
    { id: 'settings', href: '/admin/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`} role="navigation" aria-label="Admin sidebar">
      <div className="logo" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Link href="/admin/dashboard"><span style={{fontWeight:700}}>FI</span></Link>
      </div>

      <nav className="nav-list" aria-label="Primary">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link key={it.id} href={it.href} passHref>
              <a
                className={`nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                aria-label={it.label}
                title={it.label}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <span className="sidebar-icon-inner">{it.icon}</span>
                {!collapsed && <span style={{marginLeft:10, fontSize:13, fontWeight:600}} className="hidden md:inline">{it.label}</span>}
              </a>
            </Link>
          );
        })}
      </nav>

      <div style={{marginTop:'auto', display:'flex', flexDirection:'column', gap:8, alignItems:'center'}}>
        <button
          className="sidebar-icon"
          onClick={() => setCollapsed((s) => !s)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          <div className="glow" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
    </aside>
  );
}

""use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    ShoppingBag,
    Package,
    Files,
    Users,
    Settings,
    LogOut
} from "lucide-react";
import { clsx } from "clsx";

const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/" },
    { icon: ShoppingBag, label: "Siparişler", href: "/orders" },
    { icon: Package, label: "Envanter", href: "/inventory" },
    { icon: Files, label: "Maliyet Yükle", href: "/costs" },
    { icon: Users, label: "Kullanıcılar", href: "/users" },
    { icon: Settings, label: "Ayarlar", href: "/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar glass">
            <div className="logo" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', letterSpacing: '2px', textAlign: 'center' }}>
                    TWOGRAZIA
                </h2>
                <p style={{ fontSize: '0.6rem', textAlign: 'center', opacity: 0.5 }}>OPERATIONS PANEL</p>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "btn",
                                isActive ? "btn-primary" : "glass"
                            )}
                            style={{
                                justifyContent: 'flex-start',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                border: isActive ? 'none' : '1px solid var(--glass-border)',
                                color: isActive ? '#000' : 'var(--foreground)'
                            }}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <button
                    className="btn glass"
                    style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--error)' }}
                >
                    <LogOut size={18} />
                    <span>Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
}

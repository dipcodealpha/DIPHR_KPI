"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    href: "/dashboard",
    label: "대시보드",
    matchers: ["/dashboard"]
  },
  {
    href: "/projects",
    label: "사업 관리",
    matchers: ["/projects"]
  },
  {
    href: "/programs",
    label: "교육 관리",
    matchers: ["/programs"]
  }
];

function isActivePath(pathname: string, matchers: string[]) {
  return matchers.some((matcher) => pathname === matcher || pathname.startsWith(`${matcher}/`));
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-300 bg-slate-900 text-slate-100 lg:flex lg:flex-col">
      <div className="border-b border-slate-700 px-6 py-6">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Integrated Admin
        </div>
        <div className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
          내부 관리도구
        </div>
        <div className="mt-1 text-sm leading-6 text-slate-300">
          사업 · 교육 · 성과 통합 관리
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          메뉴
        </div>

        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.matchers);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center rounded-lg border px-4 py-3 text-sm font-medium transition",
                    active
                      ? "border-slate-600 bg-slate-800 text-white"
                      : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white"
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-700 px-6 py-4 text-xs leading-5 text-slate-400">
        운영 화면은 데스크톱 기준으로 최적화되어 있습니다.
      </div>
    </aside>
  );
}
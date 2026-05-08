"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { isActivePath, navigationItems } from "@/components/layout/navigation-items";

function getSectionLabel(pathname: string) {
  if (pathname === "/dashboard") return "대시보드";
  if (pathname.startsWith("/projects")) return "사업 관리";
  if (pathname.startsWith("/programs")) return "교육 관리";
  if (pathname === "/access") return "접근 제어";
  return "통합 관리도구";
}

function getSectionDescription(pathname: string) {
  if (pathname === "/dashboard") return "성과 현황과 운영 상태를 통합 확인합니다.";
  if (pathname.startsWith("/projects")) {
    return "사업 등록, 수정, 비활성화 등 사업 정보를 관리합니다.";
  }
  if (pathname.startsWith("/programs")) {
    return "교육 등록, 수정, 상태 관리와 운영 이력을 확인합니다.";
  }
  if (pathname === "/access") return "공통 입장 비밀번호를 확인합니다.";
  return "운영 데이터를 확인하고 관리합니다.";
}

export function Topbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { title, description } = useMemo(
    () => ({
      title: getSectionLabel(pathname),
      description: getSectionDescription(pathname)
    }),
    [pathname]
  );

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function handleViewportChange(event: MediaQueryListEvent | MediaQueryList) {
      if (event.matches) {
        setMobileMenuOpen(false);
      }
    }

    handleViewportChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleViewportChange);

      return () => {
        mediaQuery.removeEventListener("change", handleViewportChange);
      };
    }

    mediaQuery.addListener(handleViewportChange);

    return () => {
      mediaQuery.removeListener(handleViewportChange);
    };
  }, []);

  return (
    <>
      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
              aria-label="메뉴 열기"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <span className="text-lg leading-none">≡</span>
            </button>

            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Administration
              </div>
              <h1 className="mt-1 truncate text-xl font-semibold tracking-[-0.02em] text-slate-900">
                {title}
              </h1>
              <p className="mt-1 truncate text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          </div>

          <div className="hidden rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-right lg:block">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              운영 상태
            </div>
            <div className="mt-1 text-sm font-medium text-slate-700">
              조회 결과 기준 확인
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            aria-label="메뉴 닫기"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside
            id="mobile-navigation-drawer"
            aria-modal="true"
            role="dialog"
            className="relative flex h-full w-[288px] max-w-[85vw] flex-col border-r border-slate-300 bg-slate-900 text-slate-100 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-700 px-5 py-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Integrated Admin
                </div>
                <div className="mt-2 text-lg font-semibold text-white">통합 관리도구</div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                aria-label="메뉴 닫기"
              >
                <span className="text-base leading-none">×</span>
              </button>
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
                        onClick={() => setMobileMenuOpen(false)}
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
          </aside>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

function getSectionLabel(pathname: string) {
  if (pathname === "/dashboard") return "대시보드";
  if (pathname.startsWith("/projects")) return "사업 관리";
  if (pathname.startsWith("/programs")) return "교육 관리";
  if (pathname === "/access") return "접근 제어";
  return "내부 관리도구";
}

function getSectionDescription(pathname: string) {
  if (pathname === "/dashboard") return "성과 현황과 운영 상태를 통합 확인합니다.";
  if (pathname.startsWith("/projects")) return "사업 등록, 수정, 비활성화 등 사업 정보를 관리합니다.";
  if (pathname.startsWith("/programs")) return "교육 등록, 수정, 상태 관리와 운영 이력을 확인합니다.";
  if (pathname === "/access") return "공통 입장 비밀번호를 확인합니다.";
  return "운영 데이터를 확인하고 관리합니다.";
}

export function Topbar() {
  const pathname = usePathname();

  const { title, description } = useMemo(
    () => ({
      title: getSectionLabel(pathname),
      description: getSectionDescription(pathname)
    }),
    [pathname]
  );

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between px-6 py-4 lg:px-8">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Internal Workspace
          </div>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 truncate text-sm text-slate-500">{description}</p>
        </div>

        <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right lg:block">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            Status
          </div>
          <div className="mt-1 text-sm font-medium text-slate-700">운영 모드</div>
        </div>
      </div>
    </header>
  );
}
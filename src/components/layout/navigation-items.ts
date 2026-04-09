export interface NavigationItem {
  href: string;
  label: string;
  matchers: string[];
}

export const navigationItems: NavigationItem[] = [
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

export function isActivePath(pathname: string, matchers: string[]) {
  return matchers.some((matcher) => pathname === matcher || pathname.startsWith(`${matcher}/`));
}

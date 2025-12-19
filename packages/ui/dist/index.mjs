"use client";

// src/components/common/Header.tsx
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var BLACK_LOGO_PAGES = ["/", "/inquiry"];
function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isTransparent = BLACK_LOGO_PAGES.includes(pathname);
  const logoSrc = isTransparent ? "/images/logos/blackLogo.svg" : "/images/logos/whiteLogo.svg";
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "header",
      {
        className: `fixed top-0 left-0 z-50 w-full border-b transition-all duration-300 ${isTransparent ? "border-transparent bg-white/30 backdrop-blur-md" : "border-gray-200 bg-white"} ${isVisible ? "translate-y-0" : "-translate-y-full"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12", children: [
            /* @__PURE__ */ jsx(Link, { href: "/", className: "flex items-center", children: /* @__PURE__ */ jsx(
              Image,
              {
                src: logoSrc,
                alt: "DD4D Logo",
                width: 92,
                height: 24,
                className: "h-6"
              }
            ) }),
            /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-10 md:flex", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/clubs",
                  className: `text-[15px] transition-colors hover:text-gray-600 ${pathname?.startsWith("/clubs") ? "font-semibold text-gray-900" : "font-normal text-gray-400"}`,
                  children: "\uB3D9\uC544\uB9AC"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/announcements",
                  className: `text-[15px] transition-colors hover:text-gray-600 ${pathname?.startsWith("/announcements") ? "font-semibold text-gray-900" : "font-normal text-gray-400"}`,
                  children: "\uACF5\uACE0"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/about",
                  className: `text-[15px] transition-colors hover:text-gray-600 ${pathname?.startsWith("/about") ? "font-semibold text-gray-900" : "font-normal text-gray-400"}`,
                  children: "\uC18C\uAC1C"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-3 md:flex", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/login",
                className: "font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600",
                children: "\uB85C\uADF8\uC778"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/signup",
                className: "font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600",
                children: "\uD68C\uC6D0\uAC00\uC785"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
              className: "flex h-10 w-10 items-center justify-center md:hidden",
              "aria-label": "\uBA54\uB274 \uC5F4\uAE30",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "h-6 w-6 text-gray-700",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  children: isMobileMenuOpen ? /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M6 18L18 6M6 6l12 12"
                    }
                  ) : /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M4 6h16M4 12h16M4 18h16"
                    }
                  )
                }
              )
            }
          )
        ] })
      }
    ),
    isMobileMenuOpen && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-40 bg-black/50 md:hidden",
        onClick: () => setIsMobileMenuOpen(false),
        "aria-label": "\uBA54\uB274 \uB2EB\uAE30"
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transition-transform duration-300 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`,
        children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-col p-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/clubs",
              onClick: handleLinkClick,
              className: `border-gray-100 border-b py-4 text-[15px] transition-colors ${pathname?.startsWith("/clubs") ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`,
              children: "\uB3D9\uC544\uB9AC"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/announcements",
              onClick: handleLinkClick,
              className: `border-gray-100 border-b py-4 text-[15px] transition-colors ${pathname?.startsWith("/announcements") ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`,
              children: "\uACF5\uACE0"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/about",
              onClick: handleLinkClick,
              className: `border-gray-100 border-b py-4 text-[15px] transition-colors ${pathname?.startsWith("/about") ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`,
              children: "\uC18C\uAC1C"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/login",
                onClick: handleLinkClick,
                className: "rounded-lg bg-gray-100 py-3 text-center font-medium text-[15px] text-gray-700 transition-colors hover:bg-gray-200",
                children: "\uB85C\uADF8\uC778"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/signup",
                onClick: handleLinkClick,
                className: "rounded-lg bg-primary-500 py-3 text-center font-medium text-[15px] text-white transition-colors hover:bg-primary-600",
                children: "\uD68C\uC6D0\uAC00\uC785"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}

// src/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/ui/button.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx2(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
export {
  Button,
  Header,
  buttonVariants
};

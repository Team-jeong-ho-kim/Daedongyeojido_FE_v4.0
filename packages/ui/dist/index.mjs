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

// src/components/ui/icons/announcements/index.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var NoteIcon = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 33 42",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    children: [
      /* @__PURE__ */ jsx3("title", { children: "Note" }),
      /* @__PURE__ */ jsx3(
        "path",
        {
          d: "M7.5 24H19.5V27H7.5V24ZM7.5 16.5H25.5V19.5H7.5V16.5ZM7.5 31.5H15V34.5H7.5V31.5Z",
          fill: "currentColor"
        }
      ),
      /* @__PURE__ */ jsx3(
        "path",
        {
          d: "M30 4.5H25.5V3C25.5 2.20435 25.1839 1.44129 24.6213 0.87868C24.0587 0.31607 23.2956 0 22.5 0H10.5C9.70435 0 8.94129 0.31607 8.37868 0.87868C7.81607 1.44129 7.5 2.20435 7.5 3V4.5H3C2.20435 4.5 1.44129 4.81607 0.87868 5.37868C0.31607 5.94129 0 6.70435 0 7.5V39C0 39.7957 0.31607 40.5587 0.87868 41.1213C1.44129 41.6839 2.20435 42 3 42H30C30.7956 42 31.5587 41.6839 32.1213 41.1213C32.6839 40.5587 33 39.7957 33 39V7.5C33 6.70435 32.6839 5.94129 32.1213 5.37868C31.5587 4.81607 30.7956 4.5 30 4.5ZM10.5 3H22.5V9H10.5V3ZM30 39H3V7.5H7.5V12H25.5V7.5H30V39Z",
          fill: "currentColor"
        }
      )
    ]
  }
);
var CheckIcon = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 36 36",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    children: [
      /* @__PURE__ */ jsx3("title", { children: "Check" }),
      /* @__PURE__ */ jsx3(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M18 36C20.3638 36 22.7044 35.5344 24.8883 34.6298C27.0722 33.7253 29.0565 32.3994 30.7279 30.7279C32.3994 29.0565 33.7253 27.0722 34.6298 24.8883C35.5344 22.7044 36 20.3638 36 18C36 15.6362 35.5344 13.2956 34.6298 11.1117C33.7253 8.92784 32.3994 6.94353 30.7279 5.27208C29.0565 3.60062 27.0722 2.27475 24.8883 1.37017C22.7044 0.465584 20.3638 -3.52233e-08 18 0C13.2261 7.11366e-08 8.64773 1.89642 5.27208 5.27208C1.89642 8.64773 0 13.2261 0 18C0 22.7739 1.89642 27.3523 5.27208 30.7279C8.64773 34.1036 13.2261 36 18 36ZM17.536 25.28L27.536 13.28L24.464 10.72L15.864 21.038L11.414 16.586L8.586 19.414L14.586 25.414L16.134 26.962L17.536 25.28Z",
          fill: "currentColor"
        }
      )
    ]
  }
);
var CalendarIcon = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 36 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    children: [
      /* @__PURE__ */ jsx3("title", { children: "Calendar" }),
      /* @__PURE__ */ jsx3(
        "path",
        {
          d: "M30.6 4H27V2C27 1.46957 26.8104 0.960859 26.4728 0.585786C26.1352 0.210714 25.6774 0 25.2 0C24.7226 0 24.2648 0.210714 23.9272 0.585786C23.5896 0.960859 23.4 1.46957 23.4 2V4H12.6V2C12.6 1.46957 12.4104 0.960859 12.0728 0.585786C11.7352 0.210714 11.2774 0 10.8 0C10.3226 0 9.86477 0.210714 9.52721 0.585786C9.18964 0.960859 9 1.46957 9 2V4H5.4C3.96783 4 2.59432 4.63214 1.58162 5.75736C0.568927 6.88258 0 8.4087 0 10V34C0 35.5913 0.568927 37.1174 1.58162 38.2426C2.59432 39.3679 3.96783 40 5.4 40H30.6C32.0322 40 33.4057 39.3679 34.4184 38.2426C35.4311 37.1174 36 35.5913 36 34V10C36 8.4087 35.4311 6.88258 34.4184 5.75736C33.4057 4.63214 32.0322 4 30.6 4ZM32.4 34C32.4 34.5304 32.2104 35.0391 31.8728 35.4142C31.5352 35.7893 31.0774 36 30.6 36H5.4C4.92261 36 4.46477 35.7893 4.12721 35.4142C3.78964 35.0391 3.6 34.5304 3.6 34V20H32.4V34ZM32.4 16H3.6V10C3.6 9.46957 3.78964 8.96086 4.12721 8.58579C4.46477 8.21071 4.92261 8 5.4 8H9V10C9 10.5304 9.18964 11.0391 9.52721 11.4142C9.86477 11.7893 10.3226 12 10.8 12C11.2774 12 11.7352 11.7893 12.0728 11.4142C12.4104 11.0391 12.6 10.5304 12.6 10V8H23.4V10C23.4 10.5304 23.5896 11.0391 23.9272 11.4142C24.2648 11.7893 24.7226 12 25.2 12C25.6774 12 26.1352 11.7893 26.4728 11.4142C26.8104 11.0391 27 10.5304 27 10V8H30.6C31.0774 8 31.5352 8.21071 31.8728 8.58579C32.2104 8.96086 32.4 9.46957 32.4 10V16Z",
          fill: "currentColor"
        }
      )
    ]
  }
);
var InterviewIcon = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 45 42",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    children: [
      /* @__PURE__ */ jsx3("title", { children: "Interview" }),
      /* @__PURE__ */ jsx3(
        "path",
        {
          d: "M31.512 6.72C35.552 11.12 35.552 17.22 31.512 21.26L28.152 17.88C29.832 15.52 29.832 12.46 28.152 10.1L31.512 6.72ZM38.132 0C46.012 8.1 45.932 20.22 38.132 28L34.872 24.74C40.412 18.38 40.412 9.3 34.872 3.26L38.132 0ZM16.012 6C20.412 6 24.012 9.58 24.012 14C24.012 18.42 20.412 22 16.012 22C11.612 22 8.012 18.42 8.012 14C8.012 9.58 11.592 6 16.012 6ZM24.012 27.08C24.012 29.2 23.432 34.14 19.612 39.66L18.012 30L19.872 26.24C18.632 26.1 17.332 26 16.012 26C14.692 26 13.352 26.1 12.112 26.24L14.012 30L12.372 39.66C8.552 34.14 8.012 29.2 8.012 27.08C3.212 28.48 0 31 0 34V42H32.012V34C32.012 31 28.792 28.48 24.012 27.08Z",
          fill: "currentColor"
        }
      )
    ]
  }
);

// src/components/ui/icons/blackLogo.svg
var blackLogo_default = "./blackLogo-43BH4TVB.svg";

// src/components/ui/icons/whiteLogo.svg
var whiteLogo_default = "./whiteLogo-QJKYLOQC.svg";
export {
  Button,
  CalendarIcon,
  CheckIcon,
  Header,
  InterviewIcon,
  NoteIcon,
  blackLogo_default as blackLogo,
  buttonVariants,
  whiteLogo_default as whiteLogo
};

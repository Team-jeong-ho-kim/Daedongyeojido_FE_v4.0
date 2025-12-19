"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Button: () => Button,
  Header: () => Header,
  buttonVariants: () => buttonVariants
});
module.exports = __toCommonJS(index_exports);

// src/components/common/Header.tsx
var import_image = __toESM(require("next/image"));
var import_link = __toESM(require("next/link"));
var import_navigation = require("next/navigation");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var BLACK_LOGO_PAGES = ["/", "/inquiry"];
function Header() {
  const [isVisible, setIsVisible] = (0, import_react.useState)(true);
  const [lastScrollY, setLastScrollY] = (0, import_react.useState)(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, import_react.useState)(false);
  const pathname = (0, import_navigation.usePathname)();
  const isTransparent = BLACK_LOGO_PAGES.includes(pathname);
  const logoSrc = isTransparent ? "/images/logos/blackLogo.svg" : "/images/logos/whiteLogo.svg";
  (0, import_react.useEffect)(() => {
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
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "header",
      {
        className: `fixed top-0 left-0 z-50 w-full border-b transition-all duration-300 ${isTransparent ? "border-transparent bg-white/30 backdrop-blur-md" : "border-gray-200 bg-white"} ${isVisible ? "translate-y-0" : "-translate-y-full"}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-12", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_link.default, { href: "/", className: "flex items-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_image.default,
              {
                src: logoSrc,
                alt: "DD4D Logo",
                width: 92,
                height: 24,
                className: "h-6"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { className: "hidden items-center gap-10 md:flex", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_link.default,
                {
                  href: "/clubs",
                  className: `text-[15px] transition-colors hover:text-gray-600 ${pathname?.startsWith("/clubs") ? "font-semibold text-gray-900" : "font-normal text-gray-400"}`,
                  children: "\uB3D9\uC544\uB9AC"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_link.default,
                {
                  href: "/announcements",
                  className: `text-[15px] transition-colors hover:text-gray-600 ${pathname?.startsWith("/announcements") ? "font-semibold text-gray-900" : "font-normal text-gray-400"}`,
                  children: "\uACF5\uACE0"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_link.default,
                {
                  href: "/about",
                  className: `text-[15px] transition-colors hover:text-gray-600 ${pathname?.startsWith("/about") ? "font-semibold text-gray-900" : "font-normal text-gray-400"}`,
                  children: "\uC18C\uAC1C"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "hidden items-center gap-3 md:flex", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_link.default,
              {
                href: "/login",
                className: "font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600",
                children: "\uB85C\uADF8\uC778"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-300", children: "|" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_link.default,
              {
                href: "/signup",
                className: "font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600",
                children: "\uD68C\uC6D0\uAC00\uC785"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
              className: "flex h-10 w-10 items-center justify-center md:hidden",
              "aria-label": "\uBA54\uB274 \uC5F4\uAE30",
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "svg",
                {
                  className: "h-6 w-6 text-gray-700",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  children: isMobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M6 18L18 6M6 6l12 12"
                    }
                  ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    isMobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-40 bg-black/50 md:hidden",
        onClick: () => setIsMobileMenuOpen(false),
        "aria-label": "\uBA54\uB274 \uB2EB\uAE30"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: `fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transition-transform duration-300 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { className: "flex flex-col p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_link.default,
            {
              href: "/clubs",
              onClick: handleLinkClick,
              className: `border-gray-100 border-b py-4 text-[15px] transition-colors ${pathname?.startsWith("/clubs") ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`,
              children: "\uB3D9\uC544\uB9AC"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_link.default,
            {
              href: "/announcements",
              onClick: handleLinkClick,
              className: `border-gray-100 border-b py-4 text-[15px] transition-colors ${pathname?.startsWith("/announcements") ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`,
              children: "\uACF5\uACE0"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_link.default,
            {
              href: "/about",
              onClick: handleLinkClick,
              className: `border-gray-100 border-b py-4 text-[15px] transition-colors ${pathname?.startsWith("/about") ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`,
              children: "\uC18C\uAC1C"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-6 flex flex-col gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_link.default,
              {
                href: "/login",
                onClick: handleLinkClick,
                className: "rounded-lg bg-gray-100 py-3 text-center font-medium text-[15px] text-gray-700 transition-colors hover:bg-gray-200",
                children: "\uB85C\uADF8\uC778"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_link.default,
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
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority = require("class-variance-authority");

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/ui/button.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority.cva)(
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
  const Comp = asChild ? import_react_slot.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button,
  Header,
  buttonVariants
});

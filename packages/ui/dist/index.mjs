"use client";

// src/components/common/Footer.tsx
import Image from "next/image";
import { jsx, jsxs } from "react/jsx-runtime";
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "bg-gray-50 px-4 py-8 md:px-12 md:py-12 lg:px-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-gray-600", children: [
      /* @__PURE__ */ jsx(
        Image,
        {
          src: "/images/logos/whiteLogo.svg",
          alt: "\uB300\uB3D9\uC5EC\uC9C0\uB3C4",
          width: 92,
          height: 24
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: "|" }),
      /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: "\uB300\uB3D9\uC5EC\uC9C0\uB3C4" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: "|" }),
      /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: "DaeDongYeoJiDo" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 text-gray-500 text-xs leading-relaxed md:text-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "\uB300\uB355\uC18C\uD504\uD2B8\uC6E8\uC5B4\uB9C8\uC774\uC2A4\uD130\uACE0\uB4F1\uD559\uAD50\uB97C \uC704\uD55C \uC804\uACF5\uB3D9\uC544\uB9AC \uAD00\uB9AC \uC11C\uBE44\uC2A4 \uB300\uB3D9\uC5EC\uC9C0\uB3C4" }),
      /* @__PURE__ */ jsx("p", { children: "PM: \uBC15\uD0DC\uC218 | FRONTEND: \uC9C0\uB3C4\uD604, \uCD5C\uBBFC\uC218 | BACKEND: \uBC15\uD0DC\uC218, \uCC44\uB3C4\uD6C8 | DESIGN: \uC190\uD76C\uCC2C" }),
      /* @__PURE__ */ jsx("p", { children: "\uC8FC\uC18C : \uB300\uC804\uAD11\uC5ED\uC2DC \uC720\uC131\uAD6C \uAC00\uC815\uBD81\uB85C 76" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-500 text-xs md:text-sm", children: "@DAEDONGYEOJIDO" })
  ] }) });
}

// src/components/common/Header.tsx
import Image2 from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "shared";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function LandingHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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
  return /* @__PURE__ */ jsx2(
    "header",
    {
      className: `fixed top-0 left-0 z-50 w-full border-transparent border-b bg-white/70 backdrop-blur-sm transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`,
      children: /* @__PURE__ */ jsxs2("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8", children: [
        /* @__PURE__ */ jsx2(Link, { href: "/", className: "flex items-center", children: /* @__PURE__ */ jsx2(
          Image2,
          {
            src: "/images/logos/whiteLogo.svg",
            alt: "DD4D Logo",
            width: 92,
            height: 24,
            className: "h-6"
          }
        ) }),
        /* @__PURE__ */ jsx2("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx2(
          Link,
          {
            href: `${process.env.NEXT_PUBLIC_USER_URL}`,
            className: "rounded-lg bg-[#F45F5F] px-6 py-2.5 font-medium text-[15px] text-white transition-opacity hover:opacity-80",
            children: "\uC2DC\uC791\uD558\uAE30"
          }
        ) })
      ] })
    }
  );
}
function StudentHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const userInfo = useUserStore((state) => state.userInfo);
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
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    /* @__PURE__ */ jsx2(
      "header",
      {
        className: `fixed top-0 left-0 z-50 w-full border-gray-200 border-b bg-white transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`,
        children: /* @__PURE__ */ jsxs2("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8", children: [
          /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-12", children: [
            /* @__PURE__ */ jsx2(Link, { href: "/", className: "flex items-center", children: /* @__PURE__ */ jsx2(
              Image2,
              {
                src: "/images/logos/whiteLogo.svg",
                alt: "DD4D Logo",
                width: 92,
                height: 24,
                className: "h-6"
              }
            ) }),
            /* @__PURE__ */ jsxs2("nav", { className: "hidden items-center gap-10 md:flex", children: [
              /* @__PURE__ */ jsx2(
                Link,
                {
                  href: "/clubs",
                  className: `text-[15px] transition-colors ${pathname?.startsWith("/clubs") ? "font-semibold text-gray-900" : "font-normal text-gray-400 hover:text-gray-600"}`,
                  children: "\uB3D9\uC544\uB9AC"
                }
              ),
              /* @__PURE__ */ jsx2(
                Link,
                {
                  href: "/announcements",
                  className: `text-[15px] transition-colors ${pathname?.startsWith("/announcements") ? "font-semibold text-gray-900" : "font-normal text-gray-400 hover:text-gray-600"}`,
                  children: "\uACF5\uACE0"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx2("div", { className: "relative hidden items-center gap-3 md:flex", children: userInfo ? /* @__PURE__ */ jsxs2("div", { className: "relative flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs2(
              Link,
              {
                href: "/mypage",
                className: "flex items-center gap-3 transition-opacity",
                children: [
                  /* @__PURE__ */ jsx2("span", { className: "font-normal text-[15px] text-gray-400 hover:text-gray-600", children: "\uB9C8\uC774\uD398\uC774\uC9C0" }),
                  /* @__PURE__ */ jsx2("div", { className: "relative h-7 w-7 overflow-hidden rounded-full bg-gray-200", children: /* @__PURE__ */ jsx2(
                    Image2,
                    {
                      src: userInfo.profileImage || "/images/icons/profile.svg",
                      alt: "\uD504\uB85C\uD544",
                      width: 28,
                      height: 28,
                      className: "h-full w-full object-cover"
                    }
                  ) })
                ]
              }
            ),
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                onClick: () => setIsDropdownOpen(!isDropdownOpen),
                className: "transition-opacity",
                "aria-label": "\uB4DC\uB86D\uB2E4\uC6B4 \uBA54\uB274 \uC5F4\uAE30",
                children: /* @__PURE__ */ jsx2(
                  "svg",
                  {
                    className: `h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`,
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsx2(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M19 9l-7 7-7-7"
                      }
                    )
                  }
                )
              }
            ),
            isDropdownOpen && /* @__PURE__ */ jsxs2(Fragment, { children: [
              /* @__PURE__ */ jsx2(
                "button",
                {
                  type: "button",
                  className: "fixed inset-0 z-10",
                  onClick: () => setIsDropdownOpen(false),
                  "aria-label": "\uB4DC\uB86D\uB2E4\uC6B4 \uB2EB\uAE30"
                }
              ),
              /* @__PURE__ */ jsxs2("div", { className: "absolute top-full right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg", children: [
                /* @__PURE__ */ jsx2(
                  Link,
                  {
                    href: "/mypage/history",
                    onClick: () => setIsDropdownOpen(false),
                    className: "block px-6 py-3 text-center text-gray-600 text-sm transition-colors hover:bg-gray-50",
                    children: "\uC9C0\uC6D0 \uB0B4\uC5ED"
                  }
                ),
                /* @__PURE__ */ jsx2(
                  Link,
                  {
                    href: "/mypage/applications",
                    onClick: () => setIsDropdownOpen(false),
                    className: "block px-6 py-3 text-center text-gray-600 text-sm transition-colors hover:bg-gray-50",
                    children: "\uB098\uC758 \uC9C0\uC6D0\uC11C"
                  }
                ),
                /* @__PURE__ */ jsx2(
                  Link,
                  {
                    href: "/mypage/notifications",
                    onClick: () => setIsDropdownOpen(false),
                    className: "block px-6 py-3 text-center text-gray-600 text-sm transition-colors hover:bg-gray-50",
                    children: "\uC54C\uB9BC\uD568"
                  }
                )
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsx2(
            Link,
            {
              href: "/login",
              className: "font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600",
              children: "\uB85C\uADF8\uC778"
            }
          ) }),
          /* @__PURE__ */ jsx2(
            "button",
            {
              type: "button",
              onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
              className: "flex h-10 w-10 items-center justify-center md:hidden",
              "aria-label": "\uBA54\uB274 \uC5F4\uAE30",
              children: /* @__PURE__ */ jsx2(
                "svg",
                {
                  className: "h-6 w-6 text-gray-700",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  children: isMobileMenuOpen ? /* @__PURE__ */ jsx2(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M6 18L18 6M6 6l12 12"
                    }
                  ) : /* @__PURE__ */ jsx2(
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
    isMobileMenuOpen && /* @__PURE__ */ jsx2(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-40 bg-black/50 md:hidden",
        onClick: () => setIsMobileMenuOpen(false),
        "aria-label": "\uBA54\uB274 \uB2EB\uAE30"
      }
    ),
    /* @__PURE__ */ jsx2(
      "div",
      {
        className: `fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transition-transform duration-300 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`,
        children: /* @__PURE__ */ jsxs2("nav", { className: "flex flex-col p-6", children: [
          /* @__PURE__ */ jsx2(
            Link,
            {
              href: "/clubs",
              onClick: handleLinkClick,
              className: `border-gray-100 border-b py-4 text-[15px] transition-colors ${pathname?.startsWith("/clubs") ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`,
              children: "\uB3D9\uC544\uB9AC"
            }
          ),
          /* @__PURE__ */ jsx2(
            Link,
            {
              href: "/announcements",
              onClick: handleLinkClick,
              className: `border-gray-100 border-b py-4 text-[15px] transition-colors ${pathname?.startsWith("/announcements") ? "font-semibold text-gray-900" : "font-normal text-gray-600"}`,
              children: "\uACF5\uACE0"
            }
          ),
          /* @__PURE__ */ jsx2("div", { className: "mt-6 flex flex-col gap-3", children: userInfo ? /* @__PURE__ */ jsxs2(
            Link,
            {
              href: "/mypage",
              onClick: handleLinkClick,
              className: "flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 transition-colors hover:bg-gray-200",
              children: [
                /* @__PURE__ */ jsx2("span", { className: "font-medium text-[15px] text-gray-400 hover:text-gray-600", children: "\uB9C8\uC774\uD398\uC774\uC9C0" }),
                /* @__PURE__ */ jsx2("div", { className: "relative h-7 w-7 overflow-hidden rounded-full bg-gray-200", children: /* @__PURE__ */ jsx2(
                  Image2,
                  {
                    src: userInfo.profileImage || "/images/icons/profile.svg",
                    alt: "\uD504\uB85C\uD544",
                    width: 28,
                    height: 28,
                    className: "h-full w-full object-cover"
                  }
                ) })
              ]
            }
          ) : /* @__PURE__ */ jsx2(
            Link,
            {
              href: "/login",
              onClick: handleLinkClick,
              className: "rounded-lg bg-gray-100 py-3 text-center font-medium text-[15px] text-gray-700 transition-colors hover:bg-gray-200",
              children: "\uB85C\uADF8\uC778"
            }
          ) })
        ] })
      }
    )
  ] });
}

// src/components/input/ErrorMessage.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function ErrorMessage({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsx3("p", { className: "mt-1 text-red-500 text-xs", children: message });
}

// src/components/input/FieldSelector.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function FieldSelector({
  fields,
  selectedFields,
  onSelectionChange,
  error
}) {
  const toggleField = (field) => {
    if (selectedFields.includes(field)) {
      onSelectionChange(selectedFields.filter((f) => f !== field));
    } else {
      onSelectionChange([...selectedFields, field]);
    }
  };
  return /* @__PURE__ */ jsxs3("div", { children: [
    /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-2.5", children: fields.map((field) => /* @__PURE__ */ jsx4(
      "button",
      {
        type: "button",
        onClick: () => toggleField(field),
        className: `rounded-full border px-5 py-2 text-[13px] transition-colors ${selectedFields.includes(field) ? "border-[#FF8585] bg-[#FF8585] text-white" : "border-[#D5D5D5] bg-white text-[#666666] hover:border-[#BBBBBB]"}`,
        children: field
      },
      field
    )) }),
    /* @__PURE__ */ jsx4(ErrorMessage, { message: error })
  ] });
}

// src/components/input/FormField.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function FormField({
  label,
  htmlFor,
  alignTop,
  required,
  children
}) {
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      className: `grid grid-cols-[200px_1fr] py-6 ${alignTop ? "" : "items-center"}`,
      children: [
        /* @__PURE__ */ jsxs4(
          "label",
          {
            htmlFor,
            className: `pl-8 font-medium text-[15px] ${alignTop ? "pt-3" : ""}`,
            children: [
              label,
              required && /* @__PURE__ */ jsx5("span", { className: "ml-1 text-red-500", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsx5("div", { className: "mr-8", children })
      ]
    }
  );
}

// src/components/input/ImageUpload.tsx
import Image3 from "next/image";
import { useCallback, useEffect as useEffect2, useId, useState as useState2 } from "react";
import { toast } from "sonner";
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var INPUT_STYLE = "w-full rounded-md bg-white px-4 py-3.5 border-[0.1px] border-gray-200 text-base placeholder-gray-400 focus:outline-none";
function ImageUpload({
  onFileChange,
  placeholder = "\uD30C\uC77C\uC744 \uC5C5\uB85C\uB4DC \uD574\uC8FC\uC138\uC694.",
  defaultImageUrl
}) {
  const [fileName, setFileName] = useState2("");
  const [previewUrl, setPreviewUrl] = useState2(
    defaultImageUrl || null
  );
  const [isModalOpen, setIsModalOpen] = useState2(false);
  const inputId = useId();
  const fileInputId = useId();
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("JPG, JPEG, PNG, WEBP \uD615\uC2DD\uC758 \uC774\uBBF8\uC9C0\uB9CC \uC5C5\uB85C\uB4DC \uAC00\uB2A5\uD569\uB2C8\uB2E4.");
        e.target.value = "";
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result;
        setPreviewUrl(url);
        onFileChange(file, url);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  }, []);
  useEffect2(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen, handleKeyDown]);
  return /* @__PURE__ */ jsxs5(Fragment2, { children: [
    /* @__PURE__ */ jsxs5("label", { htmlFor: fileInputId, className: "relative block cursor-pointer", children: [
      /* @__PURE__ */ jsx6(
        "input",
        {
          id: inputId,
          type: "text",
          placeholder,
          readOnly: true,
          value: fileName,
          className: `${INPUT_STYLE} pointer-events-none cursor-pointer pr-12`
        }
      ),
      /* @__PURE__ */ jsx6("span", { className: "-translate-y-1/2 absolute top-1/2 right-4", children: /* @__PURE__ */ jsx6(
        Image3,
        {
          src: "/images/icons/upload.svg",
          alt: "",
          width: 18,
          height: 18,
          "aria-hidden": "true"
        }
      ) }),
      /* @__PURE__ */ jsx6(
        "input",
        {
          id: fileInputId,
          type: "file",
          accept: ".jpg,.jpeg,.png,.webp",
          onChange: handleFileUpload,
          className: "hidden"
        }
      )
    ] }),
    previewUrl && /* @__PURE__ */ jsxs5("div", { className: "mt-3 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3", children: [
      /* @__PURE__ */ jsxs5(
        "button",
        {
          type: "button",
          onClick: () => setIsModalOpen(true),
          className: "group relative h-[82px] w-[82px] cursor-pointer overflow-hidden rounded-lg bg-gray-100",
          children: [
            /* @__PURE__ */ jsx6(
              Image3,
              {
                src: previewUrl,
                alt: "Preview",
                fill: true,
                className: "object-cover"
              }
            ),
            /* @__PURE__ */ jsx6("div", { className: "absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40", children: /* @__PURE__ */ jsx6("span", { className: "text-white text-xs opacity-0 transition-opacity group-hover:opacity-100", children: "\uD06C\uAC8C \uBCF4\uAE30" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsx6(
        "label",
        {
          htmlFor: fileInputId,
          className: "cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-[14px] text-gray-700 transition-colors hover:bg-gray-50",
          children: "\uBCC0\uACBD"
        }
      )
    ] }),
    isModalOpen && previewUrl && /* @__PURE__ */ jsxs5(
      "div",
      {
        role: "dialog",
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70",
        onClick: () => setIsModalOpen(false),
        onKeyDown: () => {
        },
        children: [
          /* @__PURE__ */ jsx6(
            "button",
            {
              type: "button",
              onClick: () => setIsModalOpen(false),
              className: "absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl text-white hover:bg-white/30",
              children: "\u2715"
            }
          ),
          /* @__PURE__ */ jsx6(
            Image3,
            {
              src: previewUrl,
              alt: "Full size preview",
              width: 400,
              height: 400,
              className: "max-h-[70vh] max-w-[80vw] rounded-lg object-contain",
              onClick: (e) => e.stopPropagation()
            }
          )
        ]
      }
    )
  ] });
}

// src/components/input/LinkInput.tsx
import { useId as useId2, useState as useState3 } from "react";
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var INPUT_STYLE2 = "w-full rounded-md bg-white px-4 py-3.5 border-[0.1px] border-gray-200 text-base placeholder-gray-400 focus:outline-none";
function LinkInput({
  links,
  onLinksChange,
  placeholder = "\uB3D9\uC544\uB9AC \uAD00\uB828 \uB9C1\uD06C\uB97C \uCCA8\uBD80\uD574\uC8FC\uC138\uC694."
}) {
  const [currentLink, setCurrentLink] = useState3("");
  const [error, setError] = useState3("");
  const inputId = useId2();
  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedLink = currentLink.trim();
      if (!trimmedLink) return;
      if (!isValidUrl(trimmedLink)) {
        setError("\uC62C\uBC14\uB978 \uB9C1\uD06C \uD615\uC2DD\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694. (\uC608: https://example.com)");
        return;
      }
      setError("");
      onLinksChange([...links, { id: crypto.randomUUID(), url: trimmedLink }]);
      setCurrentLink("");
    }
  };
  const removeLink = (idToRemove) => {
    onLinksChange(links.filter((link) => link.id !== idToRemove));
  };
  return /* @__PURE__ */ jsxs6(Fragment3, { children: [
    /* @__PURE__ */ jsx7(
      "input",
      {
        id: inputId,
        type: "text",
        placeholder,
        value: currentLink,
        onChange: (e) => setCurrentLink(e.target.value),
        onKeyDown: handleKeyDown,
        className: INPUT_STYLE2
      }
    ),
    error ? /* @__PURE__ */ jsx7("p", { className: "mt-2 text-[12px] text-red-500", children: error }) : /* @__PURE__ */ jsx7("p", { className: "mt-2 ml-2 text-[#999999] text-[12px]", children: "\uC5D4\uD130\uB97C \uB204\uB974\uBA74 \uB9C1\uD06C\uAC00 \uCD94\uAC00\uB429\uB2C8\uB2E4" }),
    links.length > 0 && /* @__PURE__ */ jsx7("div", { className: "mt-3 flex flex-wrap gap-2", children: links.map((link) => /* @__PURE__ */ jsxs6(
      "div",
      {
        className: "flex items-center gap-2 rounded-full border border-[#D5D5D5] bg-white px-4 py-2",
        children: [
          /* @__PURE__ */ jsx7("span", { className: "whitespace-nowrap text-[#666666] text-[13px]", children: link.url }),
          /* @__PURE__ */ jsx7(
            "button",
            {
              type: "button",
              onClick: () => removeLink(link.id),
              className: "text-[#999999] hover:text-[#666666]",
              "aria-label": "\uB9C1\uD06C \uC0AD\uC81C",
              children: /* @__PURE__ */ jsx7(
                "svg",
                {
                  className: "h-4 w-4",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx7(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M6 18L18 6M6 6l12 12"
                    }
                  )
                }
              )
            }
          )
        ]
      },
      link.id
    )) })
  ] });
}

// src/components/input/TextArea.tsx
import { useEffect as useEffect3, useId as useId3, useRef } from "react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
function TextArea({
  value,
  onChange,
  placeholder,
  rows = 8,
  id,
  name,
  label,
  error,
  autoResize = false,
  maxHeight = 200
}) {
  const generatedId = useId3();
  const textareaId = id || generatedId;
  const textareaRef = useRef(null);
  useEffect3(() => {
    const textarea2 = textareaRef.current;
    if (!autoResize || !textarea2) return;
    textarea2.style.height = "auto";
    const scrollHeight = textarea2.scrollHeight;
    textarea2.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    textarea2.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value, autoResize, maxHeight]);
  const textarea = /* @__PURE__ */ jsxs7("div", { className: label ? "flex-1" : void 0, children: [
    /* @__PURE__ */ jsx8(
      "textarea",
      {
        ref: textareaRef,
        id: textareaId,
        name,
        placeholder,
        value,
        onChange: (e) => onChange(e.target.value),
        rows: autoResize ? 1 : rows,
        className: `w-full resize-none rounded-lg border-[0.1px] border-gray-200 bg-white px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-primary-500 focus:ring-primary-500"}`
      }
    ),
    /* @__PURE__ */ jsx8(ErrorMessage, { message: error })
  ] });
  if (!label) return textarea;
  return /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-2 md:flex-row md:items-start md:gap-0", children: [
    /* @__PURE__ */ jsx8(
      "label",
      {
        htmlFor: textareaId,
        className: "w-full font-normal text-base text-gray-900 md:w-32 md:pt-3.5",
        children: label
      }
    ),
    textarea
  ] });
}

// src/components/input/TextInput.tsx
import { useId as useId4 } from "react";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
function TextInput({
  value,
  onChange,
  placeholder,
  id,
  name,
  label,
  error,
  bgColor = "bg-white",
  disabled = false,
  ...restProps
}) {
  const generatedId = useId4();
  const inputId = id || generatedId;
  const input = /* @__PURE__ */ jsxs8("div", { className: label ? "flex-1" : void 0, children: [
    /* @__PURE__ */ jsx9(
      "input",
      {
        id: inputId,
        type: "text",
        name,
        placeholder,
        value,
        onChange: (e) => onChange(e.target.value),
        disabled,
        ...restProps,
        className: `w-full rounded-lg border-[0.1px] border-gray-200 ${bgColor} px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-primary-500 focus:ring-primary-500"} ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`
      }
    ),
    /* @__PURE__ */ jsx9(ErrorMessage, { message: error })
  ] });
  if (!label) return input;
  return /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2 md:flex-row md:items-start md:gap-0", children: [
    /* @__PURE__ */ jsx9(
      "label",
      {
        htmlFor: inputId,
        className: "w-full font-normal text-base text-gray-900 md:w-32 md:pt-3.5",
        children: label
      }
    ),
    input
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
import { jsx as jsx10 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx10(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/ui/icons/announcements/index.tsx
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
var NoteIcon = ({ className }) => /* @__PURE__ */ jsxs9(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 33 42",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    children: [
      /* @__PURE__ */ jsx11("title", { children: "Note" }),
      /* @__PURE__ */ jsx11(
        "path",
        {
          d: "M7.5 24H19.5V27H7.5V24ZM7.5 16.5H25.5V19.5H7.5V16.5ZM7.5 31.5H15V34.5H7.5V31.5Z",
          fill: "currentColor"
        }
      ),
      /* @__PURE__ */ jsx11(
        "path",
        {
          d: "M30 4.5H25.5V3C25.5 2.20435 25.1839 1.44129 24.6213 0.87868C24.0587 0.31607 23.2956 0 22.5 0H10.5C9.70435 0 8.94129 0.31607 8.37868 0.87868C7.81607 1.44129 7.5 2.20435 7.5 3V4.5H3C2.20435 4.5 1.44129 4.81607 0.87868 5.37868C0.31607 5.94129 0 6.70435 0 7.5V39C0 39.7957 0.31607 40.5587 0.87868 41.1213C1.44129 41.6839 2.20435 42 3 42H30C30.7956 42 31.5587 41.6839 32.1213 41.1213C32.6839 40.5587 33 39.7957 33 39V7.5C33 6.70435 32.6839 5.94129 32.1213 5.37868C31.5587 4.81607 30.7956 4.5 30 4.5ZM10.5 3H22.5V9H10.5V3ZM30 39H3V7.5H7.5V12H25.5V7.5H30V39Z",
          fill: "currentColor"
        }
      )
    ]
  }
);
var CheckIcon = ({ className }) => /* @__PURE__ */ jsxs9(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 36 36",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    children: [
      /* @__PURE__ */ jsx11("title", { children: "Check" }),
      /* @__PURE__ */ jsx11(
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
var CalendarIcon = ({ className }) => /* @__PURE__ */ jsxs9(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 36 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    children: [
      /* @__PURE__ */ jsx11("title", { children: "Calendar" }),
      /* @__PURE__ */ jsx11(
        "path",
        {
          d: "M30.6 4H27V2C27 1.46957 26.8104 0.960859 26.4728 0.585786C26.1352 0.210714 25.6774 0 25.2 0C24.7226 0 24.2648 0.210714 23.9272 0.585786C23.5896 0.960859 23.4 1.46957 23.4 2V4H12.6V2C12.6 1.46957 12.4104 0.960859 12.0728 0.585786C11.7352 0.210714 11.2774 0 10.8 0C10.3226 0 9.86477 0.210714 9.52721 0.585786C9.18964 0.960859 9 1.46957 9 2V4H5.4C3.96783 4 2.59432 4.63214 1.58162 5.75736C0.568927 6.88258 0 8.4087 0 10V34C0 35.5913 0.568927 37.1174 1.58162 38.2426C2.59432 39.3679 3.96783 40 5.4 40H30.6C32.0322 40 33.4057 39.3679 34.4184 38.2426C35.4311 37.1174 36 35.5913 36 34V10C36 8.4087 35.4311 6.88258 34.4184 5.75736C33.4057 4.63214 32.0322 4 30.6 4ZM32.4 34C32.4 34.5304 32.2104 35.0391 31.8728 35.4142C31.5352 35.7893 31.0774 36 30.6 36H5.4C4.92261 36 4.46477 35.7893 4.12721 35.4142C3.78964 35.0391 3.6 34.5304 3.6 34V20H32.4V34ZM32.4 16H3.6V10C3.6 9.46957 3.78964 8.96086 4.12721 8.58579C4.46477 8.21071 4.92261 8 5.4 8H9V10C9 10.5304 9.18964 11.0391 9.52721 11.4142C9.86477 11.7893 10.3226 12 10.8 12C11.2774 12 11.7352 11.7893 12.0728 11.4142C12.4104 11.0391 12.6 10.5304 12.6 10V8H23.4V10C23.4 10.5304 23.5896 11.0391 23.9272 11.4142C24.2648 11.7893 24.7226 12 25.2 12C25.6774 12 26.1352 11.7893 26.4728 11.4142C26.8104 11.0391 27 10.5304 27 10V8H30.6C31.0774 8 31.5352 8.21071 31.8728 8.58579C32.2104 8.96086 32.4 9.46957 32.4 10V16Z",
          fill: "currentColor"
        }
      )
    ]
  }
);
var InterviewIcon = ({ className }) => /* @__PURE__ */ jsxs9(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 45 42",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    children: [
      /* @__PURE__ */ jsx11("title", { children: "Interview" }),
      /* @__PURE__ */ jsx11(
        "path",
        {
          d: "M31.512 6.72C35.552 11.12 35.552 17.22 31.512 21.26L28.152 17.88C29.832 15.52 29.832 12.46 28.152 10.1L31.512 6.72ZM38.132 0C46.012 8.1 45.932 20.22 38.132 28L34.872 24.74C40.412 18.38 40.412 9.3 34.872 3.26L38.132 0ZM16.012 6C20.412 6 24.012 9.58 24.012 14C24.012 18.42 20.412 22 16.012 22C11.612 22 8.012 18.42 8.012 14C8.012 9.58 11.592 6 16.012 6ZM24.012 27.08C24.012 29.2 23.432 34.14 19.612 39.66L18.012 30L19.872 26.24C18.632 26.1 17.332 26 16.012 26C14.692 26 13.352 26.1 12.112 26.24L14.012 30L12.372 39.66C8.552 34.14 8.012 29.2 8.012 27.08C3.212 28.48 0 31 0 34V42H32.012V34C32.012 31 28.792 28.48 24.012 27.08Z",
          fill: "currentColor"
        }
      )
    ]
  }
);

// src/components/ui/icons/index.ts
var blackLogo = "/images/logos/blackLogo.svg";
var whiteLogo = "/images/logos/whiteLogo.svg";
var rightArrowIcon = "/images/icons/rightArrow.svg";

// src/index.ts
import { Toaster, toast as toast2 } from "sonner";
export {
  Button,
  CalendarIcon,
  CheckIcon,
  ErrorMessage,
  FieldSelector,
  Footer,
  FormField,
  ImageUpload,
  InterviewIcon,
  LandingHeader,
  LinkInput,
  NoteIcon,
  StudentHeader,
  TextArea,
  TextInput,
  Toaster,
  blackLogo,
  buttonVariants,
  rightArrowIcon,
  toast2 as toast,
  whiteLogo
};

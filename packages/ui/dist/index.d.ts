import * as react_jsx_runtime from 'react/jsx-runtime';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import * as React from 'react';

declare function Footer(): react_jsx_runtime.JSX.Element;

declare function Header(): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;

interface IconProps {
    className?: string;
}
declare const NoteIcon: ({ className }: IconProps) => react_jsx_runtime.JSX.Element;
declare const CheckIcon: ({ className }: IconProps) => react_jsx_runtime.JSX.Element;
declare const CalendarIcon: ({ className }: IconProps) => react_jsx_runtime.JSX.Element;
declare const InterviewIcon: ({ className }: IconProps) => react_jsx_runtime.JSX.Element;

declare const blackLogo = "/images/logos/blackLogo.svg";
declare const whiteLogo = "/images/logos/whiteLogo.svg";

export { Button, CalendarIcon, CheckIcon, Footer, Header, InterviewIcon, NoteIcon, blackLogo, buttonVariants, whiteLogo };

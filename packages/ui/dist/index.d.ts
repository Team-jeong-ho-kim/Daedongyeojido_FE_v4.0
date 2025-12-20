import * as react_jsx_runtime from 'react/jsx-runtime';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import * as React from 'react';

declare function Header(): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;

import type { StaticImageData } from 'next/image';

interface IconProps {
    className?: string;
}
declare const NoteIcon: (props: IconProps) => react_jsx_runtime.JSX.Element;
declare const CheckIcon: (props: IconProps) => react_jsx_runtime.JSX.Element;
declare const CalendarIcon: (props: IconProps) => react_jsx_runtime.JSX.Element;
declare const InterviewIcon: (props: IconProps) => react_jsx_runtime.JSX.Element;
declare const blackLogo: StaticImageData;
declare const whiteLogo: StaticImageData;

export { Button, Header, buttonVariants, NoteIcon, CheckIcon, CalendarIcon, InterviewIcon, blackLogo, whiteLogo };

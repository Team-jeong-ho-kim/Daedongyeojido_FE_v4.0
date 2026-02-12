import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import { InputHTMLAttributes } from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
export { Toaster, toast } from 'sonner';

declare function Footer(): react_jsx_runtime.JSX.Element;

declare function LandingHeader(): react_jsx_runtime.JSX.Element;
declare function StudentHeader(): react_jsx_runtime.JSX.Element;

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
}
declare function LoadingOverlay({ isLoading, message, }: LoadingOverlayProps): react_jsx_runtime.JSX.Element | null;

interface SkeletonProps {
    className?: string;
}
declare function Skeleton({ className }: SkeletonProps): react_jsx_runtime.JSX.Element;
declare function SkeletonCard(): react_jsx_runtime.JSX.Element;
declare function SkeletonListItem(): react_jsx_runtime.JSX.Element;
declare function SkeletonAnnouncementCard(): react_jsx_runtime.JSX.Element;
declare function SkeletonClubCard(): react_jsx_runtime.JSX.Element;
declare function SkeletonTableRow(): react_jsx_runtime.JSX.Element;

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}
declare function Spinner({ size, className }: SpinnerProps): react_jsx_runtime.JSX.Element;
declare function SpinnerCenter({ size }: SpinnerProps): react_jsx_runtime.JSX.Element;
declare function SpinnerFullPage(): react_jsx_runtime.JSX.Element;
declare function SpinnerButton(): react_jsx_runtime.JSX.Element;

interface ErrorMessageProps {
    message?: string;
}
declare function ErrorMessage({ message }: ErrorMessageProps): react_jsx_runtime.JSX.Element | null;

interface FieldSelectorProps {
    fields: string[];
    selectedFields: string[];
    onSelectionChange: (fields: string[]) => void;
    error?: string;
}
declare function FieldSelector({ fields, selectedFields, onSelectionChange, error, }: FieldSelectorProps): react_jsx_runtime.JSX.Element;

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    alignTop?: boolean;
    required?: boolean;
    children: React.ReactNode;
}
declare function FormField({ label, htmlFor, alignTop, required, children, }: FormFieldProps): react_jsx_runtime.JSX.Element;

interface ImageUploadProps {
    onFileChange: (file: File | null, previewUrl: string | null) => void;
    placeholder?: string;
    defaultImageUrl?: string | null;
    error?: string;
}
declare function ImageUpload({ onFileChange, placeholder, defaultImageUrl, error, }: ImageUploadProps): react_jsx_runtime.JSX.Element;

interface LinkItem {
    id: string;
    url: string;
}
interface LinkInputProps {
    links: LinkItem[];
    onLinksChange: (links: LinkItem[]) => void;
    placeholder?: string;
    error?: string;
}
declare function LinkInput({ links, onLinksChange, placeholder, error: externalError, }: LinkInputProps): react_jsx_runtime.JSX.Element;

interface TextAreaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    id?: string;
    name?: string;
    label?: string;
    error?: string;
    autoResize?: boolean;
    maxHeight?: number;
}
declare function TextArea({ value, onChange, placeholder, rows, id, name, label, error, autoResize, maxHeight, }: TextAreaProps): react_jsx_runtime.JSX.Element;

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    bgColor?: string;
}
declare function TextInput({ value, onChange, placeholder, id, name, label, error, bgColor, disabled, ...restProps }: TextInputProps): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "sm" | "lg" | "default" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React$1.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
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
declare const rightArrowIcon = "/images/icons/rightArrow.svg";

/**
 * 200ms 미만의 빠른 로딩에서는 스켈레톤을 보여주지 않아
 * 불필요한 깜빡임을 방지하는 훅
 *
 * @param isLoading - 로딩 상태
 * @param delay - 스켈레톤을 표시하기 전 대기 시간 (기본값: 200ms)
 * @returns 지연된 로딩 상태
 */
declare function useDeferredLoading(isLoading: boolean, delay?: number): boolean;

export { Button, CalendarIcon, CheckIcon, ErrorMessage, FieldSelector, Footer, FormField, ImageUpload, InterviewIcon, LandingHeader, LinkInput, LoadingOverlay, NoteIcon, Skeleton, SkeletonAnnouncementCard, SkeletonCard, SkeletonClubCard, SkeletonListItem, SkeletonTableRow, Spinner, SpinnerButton, SpinnerCenter, SpinnerFullPage, StudentHeader, TextArea, TextInput, blackLogo, buttonVariants, rightArrowIcon, useDeferredLoading, whiteLogo };

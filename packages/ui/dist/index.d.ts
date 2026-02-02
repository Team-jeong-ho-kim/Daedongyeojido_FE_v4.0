import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import { InputHTMLAttributes } from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
export { Toaster, toast } from 'sonner';

declare function Footer(): react_jsx_runtime.JSX.Element;

declare function LandingHeader(): react_jsx_runtime.JSX.Element;
declare function StudentHeader(): react_jsx_runtime.JSX.Element;

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
}
declare function ImageUpload({ onFileChange, placeholder, }: ImageUploadProps): react_jsx_runtime.JSX.Element;

interface LinkItem {
    id: string;
    url: string;
}
interface LinkInputProps {
    links: LinkItem[];
    onLinksChange: (links: LinkItem[]) => void;
    placeholder?: string;
}
declare function LinkInput({ links, onLinksChange, placeholder, }: LinkInputProps): react_jsx_runtime.JSX.Element;

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
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
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

export { Button, CalendarIcon, CheckIcon, ErrorMessage, FieldSelector, Footer, FormField, ImageUpload, InterviewIcon, LandingHeader, LinkInput, NoteIcon, StudentHeader, TextArea, TextInput, blackLogo, buttonVariants, rightArrowIcon, whiteLogo };

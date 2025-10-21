import * as class_variance_authority_types from "class-variance-authority/types";
import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { ClassValue } from "clsx";

declare const buttonVariants: (
  props?:
    | ({
        variant?:
          | "default"
          | "destructive"
          | "outline"
          | "secondary"
          | "ghost"
          | "link"
          | null
          | undefined;
        size?: "default" | "sm" | "lg" | "icon" | null | undefined;
      } & class_variance_authority_types.ClassProp)
    | undefined,
) => string;
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;

declare function cn(...inputs: ClassValue[]): string;

export { Button, type ButtonProps, buttonVariants, cn };

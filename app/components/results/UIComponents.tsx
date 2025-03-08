import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border shadow-sm ${
      className?.includes('bg-gray-800') 
        ? 'border-gray-700 bg-gray-800' 
        : 'border-gray-200 bg-white'
    } ${className || ''}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-gray-500 ${className || ''}`} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ''}`} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex items-center p-6 pt-0 ${className || ''}`} {...props} />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

// Progress component with dark mode support
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    value: number;
    className?: string;
  }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative h-2 w-full overflow-hidden rounded-full ${
      className?.includes('bg-') ? className : 'bg-gray-100 dark:bg-gray-700'
    }`}
    {...props}
  >
    <div
      className={`h-full transition-all ${
        className?.includes('bg-') ? '' : 'bg-blue-600 dark:bg-blue-500'
      }`}
      style={{ width: `${value}%` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };

// Badge component with dark mode support
const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "outline";
    className?: string;
  }
>(({ className, variant = "default", ...props }, ref) => {
  const getVariantClasses = () => {
    // If a custom className is used that contains color-specific classes, prioritize those
    if (className && (className.includes('bg-') || className.includes('text-') || className.includes('border-'))) {
      return '';
    }

    switch (variant) {
      case "secondary":
        return 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
      case "outline":
        return 'bg-transparent border border-gray-200 text-gray-900 dark:border-gray-600 dark:text-gray-100';
      default:
        return 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getVariantClasses()} ${className || ''}`}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };

// Button component with dark mode support
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "secondary";
    size?: "default" | "sm" | "lg";
    className?: string;
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return 'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800';
      case "secondary":
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return 'h-8 px-3 text-xs';
      case "lg":
        return 'h-12 px-6 text-base';
      default:
        return 'h-10 px-4 text-sm';
    }
  };

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${getVariantClasses()} ${getSizeClasses()} ${className || ''}`}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };

// Separator component with dark mode support
const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
    className?: string;
  }
>(({ orientation = "horizontal", className, ...props }, ref) => (
  <div
    ref={ref}
    className={`shrink-0 bg-gray-200 dark:bg-gray-700 ${
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px"
    } ${className || ''}`}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };
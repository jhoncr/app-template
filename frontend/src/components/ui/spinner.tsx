import * as React from "react";
// import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// const spinnerVariants = cva(
//   "flex justify-center items-center",
//   {
//     defaultVariants: {},
//   }
// );

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export { Spinner };

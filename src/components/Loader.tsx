"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type LoaderProps = {
  message?: string;
  className?: string;
  fullScreen?: boolean;
};

export const Loader = ({
  message = "Loading...",
  className,
  fullScreen = false,
}: LoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen && "h-screen w-full",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </motion.div>
  );
};

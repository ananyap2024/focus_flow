import { motion } from "framer-motion";
import logoSrc from "@/assets/Logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  showText?: boolean;
  src?: string; // Image source path
}

const sizes = {
  sm: { box: 48, text: "text-lg" },
  md: { box: 80, text: "text-2xl" },
  lg: { box: 100, text: "text-3xl" },
  xl: { box: 140, text: "text-4xl" },
};

export function Logo({
  size = "md",
  animate = false,
  showText = true,
  src = logoSrc,
}: LogoProps) {
  const { box, text } = sizes[size];

  return (
    <div className="flex flex-col items-center gap-4 relative z-10">
      <motion.div
        initial={animate ? { scale: 0.8, opacity: 0 } : false}
        animate={animate ? { scale: 1, opacity: 1 } : false}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8
        }}
        className="relative flex items-center justify-center"
        style={{ width: box, height: box }}
      >
        {/* Glow Container - Absolutely centered */}
        <div className="absolute inset-0 flex items-center justify-center z-[-1]">
          <motion.div
            animate={
              animate
                ? {
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.45, 0.3],
                }
                : { opacity: 0.3 }
            }
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="rounded-full bg-[#4F8CFF] blur-2xl"
            style={{
              width: box * 1.8,
              height: box * 1.8,
            }}
          />
        </div>

        {/* Logo Image - Strictly relative and centered */}
        <img
          src={src}
          alt="FocusFlow"
          className="relative z-10 w-full h-full object-contain scale-[1.7] drop-shadow-xl"
          draggable={false}
        />
      </motion.div>

      {showText && (
        <motion.h1
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={animate ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`${text} font-bold tracking-tight text-foreground text-center relative z-10`}
        >
          FocusFlow
        </motion.h1>
      )}
    </div>
  );
}

"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-[#0b1120] text-white",
          className,
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              "--aurora":
                "repeating-linear-gradient(115deg,#0ea5e9_10%,#0284c7_20%,#1e3a8a_30%,#312e81_40%,#0f172a_50%)",
              "--dark-gradient":
                "repeating-linear-gradient(115deg,#0b1120_0%,#0b1120_7%,transparent_10%,transparent_12%,#0b1120_16%)",
              "--white-gradient":
                "repeating-linear-gradient(115deg,#e0f2fe_0%,#e0f2fe_7%,transparent_10%,transparent_12%,#e0f2fe_16%)",

              "--sky-500": "#0ea5e9",   // azul cielo
              "--blue-600": "#0284c7", // azul intenso
              "--indigo-900": "#1e3a8a", // índigo profundo
              "--violet-900": "#312e81", // púrpura azulado
              "--midnight": "#0f172a",   // azul noche             //after:mix-blend-difference 
              "--black": "#0b1120",
              "--white": "#e0f2fe",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px]
              [background-image:var(--white-gradient),var(--aurora)]
              [background-size:300%,_200%] [background-position:50%_50%,50%_50%]
              opacity-40 blur-[20px] filter will-change-transform
              [--aurora:repeating-linear-gradient(115deg,var(--sky-500)_10%,var(--blue-600)_20%,var(--indigo-900)_30%,var(--violet-900)_40%,var(--midnight)_50%)]
              [--dark-gradient:repeating-linear-gradient(115deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
              [--white-gradient:repeating-linear-gradient(115deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
              after:absolute after:inset-0
              after:[background-image:var(--white-gradient),var(--aurora)]
              after:[background-size:200%,_100%]
              after:[background-attachment:fixed]
              after:content-[""]
              dark:[background-image:var(--dark-gradient),var(--aurora)]
              after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
            )}
          ></div> 
        </div>
        {children}
      </div>
    </main>
  );
};

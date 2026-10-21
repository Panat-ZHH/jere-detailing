"use client";

// Zentrale GSAP-Registrierung. Seit GSAP 3.13 sind alle Plugins kostenlos (npm "gsap").
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

// Alle Animationen nur, wenn der Nutzer keine reduzierte Bewegung wünscht
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 1024px)";

export { gsap, ScrollTrigger, SplitText, useGSAP };

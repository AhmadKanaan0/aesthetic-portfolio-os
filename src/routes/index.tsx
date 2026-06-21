import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SoundProvider, useAppSound } from "@/components/sound-context";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Wallpaper from "../assets/lockscreen.jpg";

export const Route = createFileRoute("/")({
  component: App,
});

function LoginScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const { playClickSound, playErrorSound, playSuccessSound } = useAppSound();

  const timeRef = useRef<HTMLHeadingElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const loginCardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    router.preloadRoute({ to: "/desktop" });
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleScreenClick = () => {
    if (!showLogin) {
      playClickSound();
      setShowLogin(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "haru") {
      playSuccessSound();
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (containerRef.current && !prefersReducedMotion) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => { void navigate({ to: "/desktop" }); },
        });
      } else {
        navigate({ to: "/desktop" });
      }
    } else {
      playErrorSound();
      setIsWrongPassword(true);
      setTimeout(() => {
        setIsWrongPassword(false);
      }, 500);
    }
  };

  const handleCancel = () => {
    playClickSound();
    setShowLogin(false);
    setPassword("");
    setIsWrongPassword(false);
  };

  // GSAP Animations
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Initial time display animation
    if (timeRef.current && dateRef.current && hintRef.current && !showLogin) {
      if (prefersReducedMotion) {
        gsap.fromTo(
          [timeRef.current, dateRef.current, hintRef.current],
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.1 }
        );
      } else {
        gsap.fromTo(
          [timeRef.current, dateRef.current, hintRef.current],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
          }
        );

        // Pulsing hint animation
        gsap.to(hintRef.current, {
          opacity: 0.5,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }

    // Login overlay animation
    if (showLogin && overlayRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
      } else {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }

      // Hide time display
      if (timeRef.current && dateRef.current && hintRef.current) {
        if (prefersReducedMotion) {
          gsap.to([timeRef.current, dateRef.current, hintRef.current], {
            opacity: 0,
            duration: 0.3,
          });
        } else {
          gsap.to([timeRef.current, dateRef.current, hintRef.current], {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }
    }

    // Login card animation
    if (showLogin && loginCardRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(
          loginCardRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, delay: 0.2 }
        );
      } else {
        gsap.fromTo(
          loginCardRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            delay: 0.2,
            ease: "back.out(1.7)",
          }
        );
      }
    }

  }, [showLogin]);

  // Isolated shake — own useEffect so it never re-triggers the entrance animations
  useEffect(() => {
    if (!isWrongPassword || !inputRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.killTweensOf(inputRef.current, "x");
    gsap.fromTo(
      inputRef.current,
      { x: 0 },
      { x: 8, duration: 0.08, ease: "power2.out", yoyo: true, repeat: 5 }
    );
  }, [isWrongPassword]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${Wallpaper})` }}
        onClick={handleScreenClick}
      >
        {/* Time display */}
        <div className="flex flex-col items-center">
          <h1 ref={timeRef} className="text-6xl font-bold text-blue-800 mb-2">
            {formatTime(currentTime)}
          </h1>
          <p ref={dateRef} className="text-lg text-blue-600 mb-6">
            {formatDate(currentTime)}
          </p>
          <p ref={hintRef} className="text-sm text-blue-500/80">
            Click anywhere to unlock
          </p>
        </div>

        {/* Login overlay */}
        {showLogin && (
          <div
            ref={overlayRef}
            className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={loginCardRef} className="liquidGlass-wrapper lockscreen-card w-64">
              <div className="liquidGlass-effect" />
              <div className="liquidGlass-tint" />
              <div className="liquidGlass-shine" />
              <div className="liquidGlass-content w-full flex flex-col items-center">
                <Avatar className="w-20 h-20 mb-4 border-4 border-white/40">
                  <AvatarImage
                    src="/placeholder.svg?height=80&width=80"
                    alt="User"
                  />
                  <AvatarFallback className="bg-white/20 text-white text-xl">
                    ME
                  </AvatarFallback>
                </Avatar>

                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col justify-center space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      className={cn(
                        "bg-white/20 border-white/30 focus:border-white/60 rounded-xl text-white placeholder:text-white/60"
                      )}
                      autoFocus
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="h-8 w-8 shrink-0 cursor-pointer bg-white/30 hover:bg-white/50 text-white rounded-xl border border-white/30"
                      onClick={playClickSound}
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">Unlock</span>
                    </Button>
                  </div>
                  <p className="text-xs text-white/70 text-center">
                    Hint: The password is &apos;haru&apos;
                  </p>
                </form>
              </div>
            </div>

            <button
              className="liquidGlass-wrapper lockscreen-cancel mt-4 cursor-pointer p-0"
              onClick={handleCancel}
            >
              <div className="liquidGlass-effect" />
              <div className="liquidGlass-tint" />
              <div className="liquidGlass-shine" />
              <div className="liquidGlass-content">
                <X className="h-5 w-5 text-white" />
                <span className="sr-only">Cancel</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <SoundProvider>
      <LoginScreen />
    </SoundProvider>
  );
}

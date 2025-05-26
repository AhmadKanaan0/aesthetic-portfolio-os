import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Wallpaper from "../assets/lockscreen.jpg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const navigate = useNavigate();

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
      setShowLogin(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "haru") {
      navigate({ to: "/desktop" });
    } else {
      setIsWrongPassword(true);
      setTimeout(() => {
        setIsWrongPassword(false);
      }, 500);
    }
  };
  return (
    <>
      <style>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          50% {
            transform: translateX(8px);
          }
          75% {
            transform: translateX(-8px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <div
        className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${Wallpaper})` }}
        onClick={handleScreenClick}
      >
        {/* Time display */}
        <div
          className={cn(
            "flex flex-col items-center transition-all duration-500 ease-in-out",
            showLogin ? "opacity-0 scale-90" : "opacity-100 scale-100"
          )}
        >
          <h1 className="text-6xl font-bold text-blue-800 mb-2">
            {formatTime(currentTime)}
          </h1>
          <p className="text-lg text-blue-600 mb-6">
            {formatDate(currentTime)}
          </p>
          <p className="text-sm text-blue-500/80 animate-pulse">
            Click anywhere to unlock
          </p>
        </div>

        {/* Login overlay */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500 ease-in-out",
            showLogin
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-64 p-6 bg-white/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/30 flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-4 border-4 border-blue-200/50">
              <AvatarImage
                src="/placeholder.svg?height=80&width=80"
                alt="User"
              />
              <AvatarFallback className="bg-blue-200 text-blue-700 text-xl">
                ME
              </AvatarFallback>
            </Avatar>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col justify-center space-y-4"
            >
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  className={cn(
                    "pr-12 bg-white/30 border-blue-200/50 focus:border-blue-400 rounded-xl placeholder-blue-500/70",
                    isWrongPassword && "animate-shake"
                  )}
                  autoFocus
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 cursor-pointer bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Unlock</span>
                </Button>
              </div>
              <p className="text-xs text-blue-600/80 text-center">
                Hint: The password is &apos;haru&apos;
              </p>
            </form>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="mt-4 cursor-pointer text-white bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-sm rounded-full"
            onClick={() => setShowLogin(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      </div>
    </>
  );
}

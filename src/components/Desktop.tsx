import React from "react";

import { DndContext } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { AppWindow } from "./Window";
import { DesktopIcon } from "./Icon";
import { MobileIcon } from "./MobileIcon";
import { Taskbar } from "./Taskbar";
import MenuBar from "./MenuBar";
import MusicPlayerWidget from "./MusicPlayerWidget";
import Wallpaper from "../assets/wallpaper.jpg";
import Project from "../assets/project.png";
import LinkIcon from "../assets/Links.png";
import Phone from "../assets/phone.png";
import BlogIcon from "../assets/Blog.png";
import About from "../assets/about.png";
import ResumeIcon from "../assets/resume.png";
import GreetingGif from "../assets/greeting.gif";
import WaterCd from "../assets/water-cd.jpg";
import CutePuppy from "../assets/cute-puppy.jpg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AudioProvider } from "./audio-context";
import { CuteSuspenseFallback } from "./suspense-fallback";
const AboutMe = React.lazy(() => import("./pages/about-me"));
const Resume = React.lazy(() => import("./pages/resume"));
const Projects = React.lazy(() => import("./pages/projects"));
const Blog = React.lazy(() => import("./pages/blog"));
const Links = React.lazy(() => import("./pages/links"));
const Contact = React.lazy(() => import("./pages/contact"));

export default function Desktop() {
  type WindowData = {
    name: string;
    minimized: boolean;
    component: React.ReactNode;
  };

  const isDesktop = useMediaQuery("(min-width: 650px)");
  const [greeting, setGreeting] = useState("Good morning");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const desktopApps = [
    { id: "about", label: "About me", icon: About },
    { id: "resume", label: "Resume", icon: ResumeIcon },
    { id: "projects", label: "Projects", icon: Project },
    { id: "blog", label: "Blog", icon: BlogIcon },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "contact", label: "Contact me", icon: Phone },
  ];

  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);

  const getComponentForWindow = (name: string) => {
    switch (name) {
      case "About me":
        return <AboutMe />;
      case "Resume":
        return <Resume />;
      case "Projects":
        return <Projects />;
      case "Blog":
        return <Blog />;
      case "Links":
        return <Links />;
      case "Contact me":
        return <Contact />;
      default:
        return <div>Content for {name}</div>;
    }
  };

  const openWindow = (name: string) => {
    setOpenWindows((prev) => {
      if (prev.find((w) => w.name === name)) return prev;
      return [
        ...prev,
        { name, minimized: false, component: getComponentForWindow(name) },
      ];
    });
  };

  const closeWindow = (name: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.name !== name));
  };

  const minimizeWindow = (name: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.name === name ? { ...w, minimized: true } : w))
    );
  };

  const restoreWindow = (name: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.name === name ? { ...w, minimized: false } : w))
    );
  };

  const handleAppClick = (label: string) => {
    const win = openWindows.find((w) => w.name === label);
    if (win?.minimized) {
      restoreWindow(label);
    } else {
      openWindow(label);
    }
  };

  // Animation variants
  const greetingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        type: "spring",
        damping: 15,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        type: "spring",
        damping: 15,
      },
    }),
  };

  const mobileIconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: i * 0.1,
        type: "spring",
        damping: 15,
      },
    }),
  };

  // Use simpler animations for users who prefer reduced motion
  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { duration: 0.3, delay: i * 0.05 },
    }),
  };

  return (
    <AudioProvider>
    <DndContext>
      <div
        className="w-screen h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${Wallpaper})` }}
      >
        {isDesktop && <MenuBar />}

        {isDesktop && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <motion.div
              className="flex flex-col items-center"
              variants={
                prefersReducedMotion ? reducedMotionVariants : greetingVariants
              }
              initial="hidden"
              animate="visible"
            >
              <motion.img
                src={GreetingGif}
                alt="Cute greeting"
                className="w-24 h-24 mb-2 animate-float"
                whileHover={
                  prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }
                }
                style={{
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              />
              <motion.h1
                className="text-2xl font-bold text-white drop-shadow-md"
                animate={prefersReducedMotion ? {} : { opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {greeting}!
              </motion.h1>
            </motion.div>
          </div>
        )}

        {isDesktop ? (
          <div className="absolute inset-0 flex flex-col gap-4 p-4 pt-6">
            <div className="flex flex-col flex-wrap gap-4 content-start flex-1 overflow-auto pointer-events-none">
              {desktopApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  variants={
                    prefersReducedMotion ? reducedMotionVariants : iconVariants
                  }
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <DesktopIcon
                    id={app.id}
                    label={app.label}
                    icon={app.icon}
                    onDoubleClick={() => openWindow(app.label)}
                  />
                </motion.div>
              ))}
            </div>
            <MusicPlayerWidget isDesktop={true} />
            <Taskbar
              apps={desktopApps}
              openWindows={openWindows}
              onAppClick={handleAppClick}
              className="mt-auto"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between gap-8 p-4">
            <div className="flex flex-col gap-4 justify-between h-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4 auto-rows-min justify-items-center">
                  {desktopApps.slice(0, 4).map((app, index) => (
                    <motion.div
                      key={app.id}
                      variants={
                        prefersReducedMotion
                          ? reducedMotionVariants
                          : mobileIconVariants
                      }
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <MobileIcon
                        id={app.id}
                        label={app.label}
                        icon={app.icon}
                        onClick={() => openWindow(app.label)}
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <img
                    src={WaterCd}
                    className="rounded-2xl h-[160px] animate-float"
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </motion.div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <img
                    src={CutePuppy}
                    className="rounded-2xl h-[160px] animate-float"
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </motion.div>
                <div className="grid grid-cols-2 gap-4 auto-rows-min justify-items-center">
                  {desktopApps.slice(4, 6).map((app, index) => (
                    <motion.div
                      key={app.id}
                      variants={
                        prefersReducedMotion
                          ? reducedMotionVariants
                          : mobileIconVariants
                      }
                      initial="hidden"
                      animate="visible"
                      custom={index + 4}
                    >
                      <MobileIcon
                        id={app.id}
                        label={app.label}
                        icon={app.icon}
                        onClick={() => openWindow(app.label)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
              <MusicPlayerWidget isDesktop={false} />
            </div>
            <Taskbar
              apps={desktopApps}
              openWindows={openWindows}
              onAppClick={handleAppClick}
              className="mt-auto"
            />
          </div>
        )}
        <AnimatePresence mode="wait">
          {openWindows.map((win) => (
            <AppWindow
              key={win.name}
              title={win.name}
              onClose={() => closeWindow(win.name)}
              onMinimize={() => minimizeWindow(win.name)}
              isMobile={!isDesktop}
              isMinimized={win.minimized}
            >
              <React.Suspense fallback={<CuteSuspenseFallback />}>
                  {win.component}
              </React.Suspense>
            </AppWindow>
          ))}
        </AnimatePresence>
      </div>
    </DndContext>
    </AudioProvider>
  );
}

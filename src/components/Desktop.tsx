import React from "react";
import { DndContext } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { AppWindow } from "./Window";
import { DesktopIcon } from "./Icon";
import { MobileIcon } from "./MobileIcon";
import { Taskbar } from "./Taskbar";
import MenuBar from "./MenuBar";
import MusicPlayerWidget from "./MusicPlayerWidget";
import AchievementToast from "./AchievementToast";
import Wallpaper from "../assets/wallpaper.jpg";
import Project from "../assets/project.png";
import LinkIcon from "../assets/Links.png";
import Phone from "../assets/phone.png";
import BlogIcon from "../assets/Blog.png";
import About from "../assets/about.png";
import ResumeIcon from "../assets/resume.png";
import JellyfishIcon from "../assets/jellyfish.png";
import TerminalIcon from "../assets/terminal.png";
import GreetingGif from "../assets/greeting.gif";
import WaterCd from "../assets/water-cd.jpg";
import CutePuppy from "../assets/cute-puppy.jpg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AudioProvider } from "./audio-context";
import { SoundProvider } from "./sound-context";
import { MobileSettingsBar } from "./MobileSettingsBar";
import { AchievementProvider, useAchievements, type AchievementId } from "./achievement-context";

const AboutMe = React.lazy(() => import("./pages/about-me"));
const Resume = React.lazy(() => import("./pages/resume"));
const Projects = React.lazy(() => import("./pages/projects"));
const Blog = React.lazy(() => import("./pages/blog"));
const Links = React.lazy(() => import("./pages/links"));
const Contact = React.lazy(() => import("./pages/contact"));
const Achievements = React.lazy(() => import("./pages/achievements"));
const Terminal = React.lazy(() => import("./pages/terminal"));

export default function Desktop() {
  return (
    <AchievementProvider>
      <DesktopInner />
    </AchievementProvider>
  );
}

function DesktopInner() {
  type WindowData = {
    name: string;
    minimized: boolean;
    component: React.ReactNode;
  };

  const isDesktop = useMediaQuery("(min-width: 650px)");
  const [greeting, setGreeting] = useState("Good morning");
  const greetingRef = useRef<HTMLDivElement>(null);
  const greetingImageRef = useRef<HTMLImageElement>(null);
  const greetingTextRef = useRef<HTMLHeadingElement>(null);
  const desktopIconsRef = useRef<HTMLDivElement[]>([]);
  const mobileIconsRef = useRef<HTMLDivElement[]>([]);
  const floatingAnims = useRef<gsap.core.Tween[]>([]);

  const { unlock, unlocked } = useAchievements();
  const openedAppsRef = useRef<Set<string>>(new Set());
  const initialUnlockedRef = useRef(unlocked);
  const [folderPage, setFolderPage] = useState(0);
  const [folderDragOffset, setFolderDragOffset] = useState(0);
  const touchStartX = useRef(0);

  const CORE_APPS = ['About me', 'Resume', 'Projects', 'Blog', 'Links', 'Contact me'];

  useEffect(() => {
    const achievementToApp: Record<string, string> = {
      about_me: 'About me',
      resume: 'Resume',
      projects: 'Projects',
      blog: 'Blog',
      links: 'Links',
      contact: 'Contact me',
    };
    initialUnlockedRef.current.forEach(id => {
      const appName = achievementToApp[id];
      if (appName) openedAppsRef.current.add(appName);
    });
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) unlock('night_owl');
    if (hour >= 5 && hour < 7) unlock('early_bird');
  }, []);

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
    { id: "achievements", label: "Achievements", icon: JellyfishIcon },
    { id: "terminal", label: "Terminal", icon: TerminalIcon },
  ];

  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);

  useEffect(() => {
    const nonMinimized = openWindows.filter(w => !w.minimized).length;
    if (nonMinimized >= 3) unlock('multitasker');
  }, [openWindows, unlock]);

  useEffect(() => {
    if (!isDesktop) {
      const hasOpenWindow = openWindows.some((w) => !w.minimized);
      if (hasOpenWindow) {
        floatingAnims.current.forEach((anim) => anim.pause());
      } else {
        floatingAnims.current.forEach((anim) => anim.resume());
      }
    }
  }, [openWindows, isDesktop]);

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
      case "Achievements":
        return <Achievements />;
      case "Terminal":
        return <Terminal />;
      default:
        return <div>Content for {name}</div>;
    }
  };

  const appAchievements: Record<string, AchievementId> = {
    'About me': 'about_me',
    'Resume': 'resume',
    'Projects': 'projects',
    'Blog': 'blog',
    'Links': 'links',
    'Contact me': 'contact',
  };

  const openWindow = (name: string) => {
    setOpenWindows((prev) => {
      if (prev.find((w) => w.name === name)) return prev;
      return [
        ...prev,
        { name, minimized: false, component: getComponentForWindow(name) },
      ];
    });

    if (!openedAppsRef.current.has(name)) {
      openedAppsRef.current.add(name);

      if (openedAppsRef.current.size === 1) unlock('first_window');

      const achievementId = appAchievements[name];
      if (achievementId) unlock(achievementId);

      if (CORE_APPS.every(app => openedAppsRef.current.has(app))) {
        unlock('all_apps');
      }
    }
  };

  const closeWindow = (name: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.name !== name));
  };

  const minimizeWindow = (name: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.name === name ? { ...w, minimized: true } : w))
    );
    unlock('minimize');
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

  // GSAP Animations
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        if (greetingRef.current) {
          gsap.fromTo(
            greetingRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: 0.3 }
          );
        }

        desktopIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0 },
              { opacity: 1, duration: 0.3, delay: index * 0.05 }
            );
          }
        });

        mobileIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0 },
              { opacity: 1, duration: 0.3, delay: index * 0.05 }
            );
          }
        });
        return;
      }

      if (isDesktop && greetingRef.current) {
        const tl = gsap.timeline();

        tl.fromTo(
          greetingRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
        );

        if (greetingImageRef.current) {
          tl.fromTo(
            greetingImageRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
            "-=0.5"
          );

          floatingAnims.current.push(
            gsap.to(greetingImageRef.current, {
              y: -10,
              duration: 3,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
            })
          );
        }

        if (greetingTextRef.current) {
          floatingAnims.current.push(
            gsap.to(greetingTextRef.current, {
              opacity: 0.7,
              duration: 3,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
            })
          );
        }
      }

      if (isDesktop) {
        desktopIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0, x: -20 },
              {
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: index * 0.1,
                ease: "back.out(1.7)",
              }
            );
          }
        });
      } else {
        mobileIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                delay: index * 0.1,
                ease: "back.out(1.7)",
              }
            );
          }
        });
      }

      const floatingElements =
        document.querySelectorAll<HTMLElement>(".animate-float");
      floatingElements.forEach((element) => {
        floatingAnims.current.push(
          gsap.to(element, {
            y: -10,
            duration: 6,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
          })
        );
      });
    },
    { dependencies: [isDesktop, greeting], revertOnUpdate: true }
  );

  return (
    <SoundProvider>
      <AudioProvider>
        <DndContext>
          <div
            className="w-screen h-screen overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${Wallpaper})` }}
          >
            {isDesktop && <MenuBar />}

            {isDesktop && (
              <div className="absolute top-9 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <div ref={greetingRef} className="flex flex-col items-center">
                  <img
                    ref={greetingImageRef}
                    src={GreetingGif}
                    alt="Cute greeting"
                    className="w-24 h-24 mb-2 animate-float"
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }}
                  />
                  <h1
                    ref={greetingTextRef}
                    className="text-2xl font-bold text-white drop-shadow-md"
                  >
                    {greeting}!
                  </h1>
                </div>
              </div>
            )}

            {isDesktop ? (
              <div className="absolute inset-0 flex flex-col gap-4 p-4 pt-12">
                <div className="flex flex-col flex-wrap gap-4 content-start flex-1 overflow-auto pointer-events-none">
                  {desktopApps.map((app, index) => (
                    <div
                      key={app.id}
                      ref={(el) => {
                        if (el) desktopIconsRef.current[index] = el;
                      }}
                    >
                      <DesktopIcon
                        id={app.id}
                        label={app.label}
                        icon={app.icon}
                        onDoubleClick={() => openWindow(app.label)}
                      />
                    </div>
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
              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden gap-8 p-4 pb-24">
                <div className="flex flex-col gap-4 justify-between h-full">
                  {/* Top row: 2-page folder + water CD */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Folder */}
                    <div className="liquidGlass-wrapper rounded-2xl h-[180px]">
                      <div className="liquidGlass-effect"></div>
                      <div className="liquidGlass-tint"></div>
                      <div className="liquidGlass-shine"></div>
                      <div className="liquidGlass-content flex flex-col overflow-hidden flex-1">
                        {/* Sliding pages */}
                        <div
                          className="flex flex-1 overflow-hidden"
                          onTouchStart={e => {
                            touchStartX.current = e.touches[0].clientX;
                          }}
                          onTouchMove={e => {
                            const diff = e.touches[0].clientX - touchStartX.current;
                            // Add rubber-band resistance at the edges
                            if ((folderPage === 0 && diff > 0) || (folderPage === 1 && diff < 0)) {
                              setFolderDragOffset(diff * 0.25);
                            } else {
                              setFolderDragOffset(diff);
                            }
                          }}
                          onTouchEnd={e => {
                            const diff = touchStartX.current - e.changedTouches[0].clientX;
                            if (diff > 40) setFolderPage(1);
                            else if (diff < -40) setFolderPage(0);
                            setFolderDragOffset(0);
                          }}
                        >
                          <div
                            className="flex w-full"
                            style={{
                              transform: `translateX(calc(-${folderPage * 100}% + ${folderDragOffset}px))`,
                              transition: folderDragOffset !== 0 ? 'none' : 'transform 300ms ease-out',
                            }}
                          >
                            {/* Page 1: apps 0–3 */}
                            <div className="grid grid-cols-2 gap-1 auto-rows-min justify-items-center p-2 flex-shrink-0 w-full content-start">
                              {desktopApps.slice(0, 4).map((app, index) => (
                                <div
                                  key={app.id}
                                  ref={(el) => { if (el) mobileIconsRef.current[index] = el; }}
                                >
                                  <MobileIcon
                                    id={app.id}
                                    label={app.label}
                                    icon={app.icon}
                                    onClick={() => openWindow(app.label)}
                                  />
                                </div>
                              ))}
                            </div>
                            {/* Page 2: apps 6–7 (Achievements + Terminal) */}
                            <div className="grid grid-cols-2 gap-1 auto-rows-min justify-items-center p-2 flex-shrink-0 w-full content-start">
                              {desktopApps.slice(6).map((app, index) => (
                                <div
                                  key={app.id}
                                  ref={(el) => { if (el) mobileIconsRef.current[index + 6] = el; }}
                                >
                                  <MobileIcon
                                    id={app.id}
                                    label={app.label}
                                    icon={app.icon}
                                    onClick={() => openWindow(app.label)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Page dots */}
                        <div className="flex justify-center gap-1.5 pb-2">
                          {[0, 1].map(i => (
                            <button
                              key={i}
                              onClick={() => setFolderPage(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                folderPage === i ? 'bg-white' : 'bg-white/35'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Water CD */}
                    <div className="flex justify-center">
                      <img
                        src={WaterCd}
                        className="rounded-2xl h-[180px] animate-float-smooth"
                        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
                      />
                    </div>
                  </div>

                  {/* Bottom row: puppy + apps 4–5 + settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-center">
                      <img
                        src={CutePuppy}
                        className="rounded-2xl h-[160px] animate-float-smooth"
                        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                      <div className="grid grid-cols-2 gap-2 auto-rows-min justify-items-center">
                        {desktopApps.slice(4, 6).map((app, index) => (
                          <div
                            key={app.id}
                            ref={(el) => { if (el) mobileIconsRef.current[index + 4] = el; }}
                          >
                            <MobileIcon
                              id={app.id}
                              label={app.label}
                              icon={app.icon}
                              onClick={() => openWindow(app.label)}
                            />
                          </div>
                        ))}
                      </div>
                      <MobileSettingsBar />
                    </div>
                  </div>

                  <MusicPlayerWidget isDesktop={false} />
                </div>
                <Taskbar
                  apps={desktopApps.slice(0, 6)}
                  overflowApps={desktopApps.slice(6)}
                  openWindows={openWindows}
                  onAppClick={handleAppClick}
                  className="mt-auto"
                />
              </div>
            )}

            {openWindows.map((win) => (
              <AppWindow
                key={win.name}
                title={win.name}
                onClose={() => closeWindow(win.name)}
                onMinimize={() => minimizeWindow(win.name)}
                isMobile={!isDesktop}
                isMinimized={win.minimized}
              >
                {win.component}
              </AppWindow>
            ))}

            <AchievementToast />
          </div>
        </DndContext>
      </AudioProvider>
    </SoundProvider>
  );
}

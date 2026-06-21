import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { List, Loader2, Pause, Play, SkipBack, SkipForward, Volume2, X, } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import sanrio from "../assets/sanrio.png";
import Forward from "../assets/Forward.png";
import Previous from "../assets/Previous.png";
import MusicWallpaper from "../assets/MusicWallPaper.gif";
import SliderIcon from "../assets/SliderIcon.png";
import MusicPlayerImage from "../assets/MusicPlayerImage.png";
import PlaylistIcon from "../assets/PlaylistIcon.png";
import CinamonExit from "../assets/CinamonExit.png";
import { AudioContext } from "./audio-context";
import { useAppSound } from "./sound-context";
import { useAchievements } from "./achievement-context";
import { playlist, type Track } from "@/types/types";


interface MusicPlayerProps {
  isDesktop?: boolean;
}

export default function MusicPlayerWidget({
  isDesktop = false,
}: MusicPlayerProps) {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    progress,
    volume,
    isLoading,
    setCurrentTrack,
    setIsPlaying,
    setProgress,
    setVolume,
    setIsLoading,
  } = useContext(AudioContext);

  const { playClickSound, playMenuSound, playPowerUpSound } = useAppSound();
  const { unlock } = useAchievements();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);
  const albumCoverRef = useRef<HTMLImageElement>(null);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);
  const rotationTweenRef = useRef<gsap.core.Tween | null>(null);
  const didMountRef = useRef(false);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const mobilePlaylistModalRef = useRef<HTMLDivElement>(null);

  // Handle album cover rotation
  const handleAlbumRotation = useCallback(() => {
    if (!albumCoverRef.current) return;

    // Kill existing rotation if playing state changes
    if (rotationTweenRef.current) {
      rotationTweenRef.current.kill();
    }

    if (isPlaying && !isLoading && isDesktop && !isExpanded) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!prefersReducedMotion) {
        rotationTweenRef.current = gsap.to(albumCoverRef.current, {
          rotation: 360,
          duration: 3,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center"
        });
      }
    }
  }, [isPlaying, isLoading, isExpanded, isDesktop]);

  // Button animations
  const handleButtonHover = (index: number) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const button = buttonsRef.current[index];
    if (button) {
      gsap.killTweensOf(button, "scale");
      gsap.to(button, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleButtonLeave = (index: number) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const button = buttonsRef.current[index];
    if (button) {
      gsap.killTweensOf(button, "scale");
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleButtonClick = (index: number) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const button = buttonsRef.current[index];
    if (button) {
      gsap.killTweensOf(button, "scale");
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  useEffect(() => {
    // Handle album rotation
    handleAlbumRotation();
  }, [handleAlbumRotation, isPlaying, isLoading, isExpanded]);

  // Animate in when expand/collapse state changes (skips initial render)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!playerRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    gsap.fromTo(
      playerRef.current,
      { opacity: 0, scale: 0.88, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
    );
    if (isExpanded) {
      const expandedBtns = [1, 2, 3, 4, 5]
        .map((i) => buttonsRef.current[i])
        .filter(Boolean);
      if (expandedBtns.length) {
        gsap.fromTo(
          expandedBtns,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, delay: 0.18, ease: "back.out(1.7)" }
        );
      }
    }
  }, [isExpanded]);

  // GSAP animations
  useGSAP(() => {
    // Initial animations
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Player entrance
    if (playerRef.current) {
      gsap.fromTo(
        playerRef.current,
        { opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      );
    }

    // Button entrances
    buttonsRef.current.forEach((button, index) => {
      if (button) {
        gsap.fromTo(
          button,
          { opacity: 0, scale: prefersReducedMotion ? 1 : 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            delay: 0.1 + index * 0.05,
            ease: "back.out(1.7)",
          }
        );
      }
    });

    // Cleanup
    return () => {
      // Don't kill all tweens - just specific ones if needed
    };
  }, []);

  // Desktop playlist slide animation
  useEffect(() => {
    if (!playlistRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (showPlaylist) {
      gsap.fromTo(
        playlistRef.current,
        { x: 100, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        }
      );
    } else {
      gsap.to(playlistRef.current, {
        x: 100,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "back.in(1.7)",
      });
    }
  }, [showPlaylist]);

  // Mobile playlist modal entrance animation
  useEffect(() => {
    if (!showPlaylist || !mobilePlaylistModalRef.current || isDesktop) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    gsap.fromTo(
      mobilePlaylistModalRef.current,
      { opacity: 0, y: 16, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
  }, [showPlaylist, isDesktop]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        playClickSound();
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        playPowerUpSound();
        unlock('music_head');
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  const changeTrack = (track: Track) => {
    setCurrentTrack(track);
    setProgress(0);
    playMenuSound();
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    changeTrack(playlist[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    changeTrack(playlist[prevIndex]);
  };

  const formatTime = (progress: number) => {
    if (!audioRef.current || isNaN(audioRef.current.duration)) return "0:00";
    const totalSeconds = Math.floor(
      (audioRef.current.duration * progress) / 100
    );
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = (audioRef.current.duration * value[0]) / 100;
    setProgress(value[0]);
    playClickSound();
  };

  const handleDesktopClose = () => {
    playClickSound();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!playerRef.current || reduced) {
      setIsExpanded(false);
      setShowPlaylist(false);
      return;
    }
    gsap.to(playerRef.current, {
      opacity: 0,
      scale: 0.88,
      y: 20,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setIsExpanded(false);
        setShowPlaylist(false);
      },
    });
  };

  const handleExpandClick = () => {
    setIsExpanded(true);
    playMenuSound();
  };

  const handleMobilePlaylistClose = () => {
    playClickSound();
    if (!mobilePlaylistModalRef.current) { setShowPlaylist(false); return; }
    gsap.to(mobilePlaylistModalRef.current, {
      opacity: 0, y: 14, scale: 0.97, duration: 0.2, ease: "power2.in",
      onComplete: () => setShowPlaylist(false),
    });
  };

  const handleMobileTrackSelect = (track: Track) => {
    changeTrack(track);
    if (!mobilePlaylistModalRef.current) { setShowPlaylist(false); return; }
    gsap.to(mobilePlaylistModalRef.current, {
      opacity: 0, y: 10, duration: 0.18, ease: "power2.in",
      onComplete: () => setShowPlaylist(false),
    });
  };

  const handlePlaylistToggle = () => {
    setShowPlaylist(!showPlaylist);
    playMenuSound();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!audio.duration) return;
      const newProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(newProgress) ? 0 : newProgress);
    };

    const handleEnded = () => {
      handleNext();
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  if (isDesktop && !isExpanded) {
    return (
      <div ref={playerRef} className="fixed bottom-6 right-6 z-50">
        {/* "Click to play" hint — only shown while paused */}
        {!isPlaying && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 flex flex-col items-center pointer-events-none animate-bounce">
            <div className="liquidGlass-wrapper">
              <div className="liquidGlass-effect" />
              <div className="liquidGlass-tint" />
              <div className="liquidGlass-shine" />
              <div className="liquidGlass-content px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-white">
                ♪ click to play
              </div>
            </div>
            <span
              className="text-[8px] leading-none mt-0.5"
              style={{ color: 'var(--cute-border)' }}
            >
              ▼
            </span>
          </div>
        )}

        <button
          ref={(el) => {
            if (el) buttonsRef.current[0] = el;
          }}
          className="w-20 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
          onClick={() => {
            handleExpandClick();
            handleButtonClick(0);
          }}
          onMouseEnter={() => handleButtonHover(0)}
          onMouseLeave={() => handleButtonLeave(0)}
          disabled={isLoading}
        >

          <img src={MusicPlayerImage} alt="Music Player" />
          <div
            ref={albumCoverRef}
            className="absolute top-[60.5%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full overflow-hidden border-2 border-white/30"
          >
            <img
              src={currentTrack.cover || "/placeholder.svg"}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    );
  }

  // Desktop expanded panel
  if (isDesktop && isExpanded) {
    return (
      <div
        ref={playerRef}
        className="fixed bottom-6 right-6 z-50 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-cover bg-center"
        style={{
          width: showPlaylist ? "480px" : "380px",
          height: "300px",
          backgroundImage: `url(${MusicWallpaper})`,
        }}
      >
        <div className="flex h-full w-full">
          {/* Main Player */}
          <div
            className="flex-1 p-6 flex flex-col"
            style={{
              transform: showPlaylist ? "translateX(-50px)" : "translateX(0)",
              opacity: showPlaylist ? 0.8 : 1,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Now Playing
              </h3>
              <div className="flex gap-2">
                <button
                  ref={(el) => {
                    if (el) buttonsRef.current[1] = el;
                  }}
                  className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => {
                    handlePlaylistToggle();
                    handleButtonClick(1);
                  }}
                  onMouseEnter={() => handleButtonHover(1)}
                  onMouseLeave={() => handleButtonLeave(1)}
                >
                  <img src={PlaylistIcon} alt="Playlist Icon" />
                  <div className="absolute top-[21%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <List className="h-4 w-4" />
                  </div>
                </button>
                <button
                  ref={(el) => {
                    if (el) buttonsRef.current[2] = el;
                  }}
                  className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => {
                    handleDesktopClose();
                    handleButtonClick(2);
                  }}
                  onMouseEnter={() => handleButtonHover(2)}
                  onMouseLeave={() => handleButtonLeave(2)}
                >
                  <img src={CinamonExit} alt="Cinamon Exit" />
                  <div className="absolute top-[55%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <X className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div
                ref={albumCoverRef}
                className="w-20 h-20 rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={currentTrack.cover || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 dark:text-white truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {currentTrack.artist}
                </p>
                <div className="mt-2">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    className="cursor-pointer w-full"
                    onValueChange={handleSeek}
                    disabled={isLoading}
                    trackClassName="bg-[#ccf2fc]"
                    rangeClassName="bg-[#74defc]"
                    thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                    thumb={
                      <img
                        src={SliderIcon}
                        className="w-full h-full object-cover rounded-full"
                        alt={"sliderIcon"}
                      />
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{formatTime(progress)}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                ref={(el) => {
                  if (el) buttonsRef.current[3] = el;
                }}
                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                  handlePrevious();
                  playClickSound();
                  handleButtonClick(3);
                }}
                onMouseEnter={() => handleButtonHover(3)}
                onMouseLeave={() => handleButtonLeave(3)}
                disabled={isLoading}
              >
                <img src={Previous} alt="previous" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  <SkipBack className="h-4 w-4" />
                </div>
              </button>

              <button
                ref={(el) => {
                  if (el) buttonsRef.current[4] = el;
                }}
                className="w-18 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                  handlePlayPause();
                  handleButtonClick(4);
                }}
                onMouseEnter={() => handleButtonHover(4)}
                onMouseLeave={() => handleButtonLeave(4)}
                disabled={isLoading}
              >
                <img src={sanrio} alt="sanrio" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </div>
              </button>

              <button
                ref={(el) => {
                  if (el) buttonsRef.current[5] = el;
                }}
                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                  handleNext();
                  playClickSound();
                  handleButtonClick(5);
                }}
                onMouseEnter={() => handleButtonHover(5)}
                onMouseLeave={() => handleButtonLeave(5)}
                disabled={isLoading}
              >
                <img src={Forward} alt="forward" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  <SkipForward className="h-4 w-4" />
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                className="cursor-pointer w-full flex-1"
                onValueChange={(value) => {
                  setVolume(value[0]);
                  playClickSound();
                }}
                disabled={isLoading}
                trackClassName="bg-[#ccf2fc]"
                rangeClassName="bg-[#74defc]"
                thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                thumb={
                  <img
                    src={SliderIcon}
                    className="w-full h-full object-cover rounded-full"
                    alt={"sliderIcon"}
                  />
                }
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                {volume}
              </span>
            </div>
          </div>

          {/* Playlist Panel */}
          {showPlaylist && (
            <div
              ref={playlistRef}
              className="w-80 relative overflow-hidden p-4"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px) saturate(200%)",
                WebkitBackdropFilter: "blur(20px) saturate(200%)",
                borderLeft: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "inset 2px 0 1px rgba(224,242,254,0.25)",
              }}
            >
              <h4 className="font-bold text-white mb-4">
                Playlist
              </h4>
              <div className="space-y-2 overflow-y-scroll px-2 py-2 h-[240px]">
                {playlist.map((track) => (
                  <div
                    key={track.id}
                    className="liquidGlass-wrapper cursor-pointer mb-2"
                    style={{ borderRadius: "0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "none" }}
                    onClick={() => changeTrack(track)}
                    onMouseEnter={(e) => {
                      const prefersReducedMotion = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                      ).matches;
                      if (!prefersReducedMotion) {
                        gsap.to(e.currentTarget, { scale: 1.02, duration: 0.1 });
                      }
                    }}
                    onMouseLeave={(e) => {
                      const prefersReducedMotion = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                      ).matches;
                      if (!prefersReducedMotion) {
                        gsap.to(e.currentTarget, { scale: 1, duration: 0.1 });
                      }
                    }}
                    onMouseDown={(e) => {
                      const prefersReducedMotion = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                      ).matches;
                      if (!prefersReducedMotion) {
                        gsap.to(e.currentTarget, { scale: 0.98, duration: 0.1 });
                      }
                    }}
                    onMouseUp={(e) => {
                      const prefersReducedMotion = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                      ).matches;
                      if (!prefersReducedMotion) {
                        gsap.to(e.currentTarget, { scale: 1.02, duration: 0.1 });
                      }
                    }}
                  >
                    <div className="liquidGlass-effect" style={{ borderRadius: "0.75rem" }} />
                    <div
                      className="liquidGlass-tint"
                      style={{
                        background: currentTrack.id === track.id
                          ? "rgba(96,165,250,0.4)"
                          : "rgba(255,255,255,0.12)",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <div className="liquidGlass-shine" style={{ borderRadius: "0.75rem" }} />
                    <div className="liquidGlass-content flex items-center gap-3 p-2 w-full">
                      <img
                        src={track.cover || "/placeholder.svg"}
                        alt={track.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-white/70 truncate">
                          {track.artist}
                        </p>
                      </div>
                      <span className="text-xs text-white/60">
                        {track.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile/Widget version — playlist opens as a liquid glass modal above the player
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Playlist modal */}
      {showPlaylist && (
        <div
          ref={mobilePlaylistModalRef}
          className="absolute bottom-full left-0 right-0 mb-3 z-50"
        >
          <div
            className="liquidGlass-wrapper"
            style={{ borderRadius: "1.25rem", flexDirection: "column", boxShadow: "0 -8px 32px rgba(0,0,0,0.35)" }}
          >
            <div className="liquidGlass-effect" style={{ borderRadius: "1.25rem" }} />
            <div className="liquidGlass-tint" style={{ borderRadius: "1.25rem" }} />
            <div className="liquidGlass-shine" style={{ borderRadius: "1.25rem" }} />
            <div className="liquidGlass-content w-full" style={{ padding: "1rem" }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-bold text-base">Playlist</h3>
                <button
                  className="w-8 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={handleMobilePlaylistClose}
                >
                  <img src={CinamonExit} alt="Close" />
                  <div className="absolute top-[55%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <X className="h-3 w-3" />
                  </div>
                </button>
              </div>
              <div className="space-y-2 max-h-60 p-4 overflow-y-auto">
                {playlist.map((track) => (
                  <div
                    key={track.id}
                    className="liquidGlass-wrapper cursor-pointer"
                    style={{ borderRadius: "0.75rem", transition: "none" }}
                    onClick={() => handleMobileTrackSelect(track)}
                    onMouseEnter={(e) => {
                      const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                      if (!r) gsap.to(e.currentTarget, { scale: 1.02, duration: 0.1 });
                    }}
                    onMouseLeave={(e) => {
                      const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                      if (!r) gsap.to(e.currentTarget, { scale: 1, duration: 0.1 });
                    }}
                  >
                    <div className="liquidGlass-effect" style={{ borderRadius: "0.75rem" }} />
                    <div
                      className="liquidGlass-tint"
                      style={{
                        background: currentTrack.id === track.id ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.12)",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <div className="liquidGlass-shine" style={{ borderRadius: "0.75rem" }} />
                    <div className="liquidGlass-content flex items-center gap-3 p-2.5 w-full">
                      <img src={track.cover || "/placeholder.svg"} alt={track.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-white truncate">{track.title}</p>
                        <p className="text-xs text-white/70 truncate">{track.artist}</p>
                      </div>
                      <span className="text-xs text-white/60 shrink-0">{track.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player — always visible */}
      <div
        ref={playerRef}
        className="w-full h-[170px] rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${MusicWallpaper})` }}
      >
          <div ref={mobileContentRef} className="p-4 gap-4 flex flex-row items-center h-full">
            <div
              ref={albumCoverRef}
              className={cn(
                "w-32 h-32 rounded-2xl overflow-hidden shadow-md transform transition-transform",
                isLoading ? "opacity-80" : "opacity-100"
              )}
            >
              <img
                src={currentTrack.cover || "/placeholder.svg"}
                alt={`${currentTrack.title} album cover`}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col flex-1 gap-3 h-full justify-between">
              <div className="w-full flex flex-col items-start">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate w-full">
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate w-full">
                  {currentTrack.artist}
                </p>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <button
                    ref={(el) => {
                      if (el) buttonsRef.current[6] = el;
                    }}
                    className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                    onClick={() => {
                      handlePrevious();
                      playClickSound();
                      handleButtonClick(6);
                    }}
                    onMouseEnter={() => handleButtonHover(6)}
                    onMouseLeave={() => handleButtonLeave(6)}
                    disabled={isLoading}
                  >
                    <img src={Previous} alt="previous" />
                    <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                      <SkipBack className="h-3 w-3" />
                    </div>
                  </button>

                  <button
                    ref={(el) => {
                      if (el) buttonsRef.current[7] = el;
                    }}
                    className="w-16 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                    onClick={() => {
                      handlePlayPause();
                      handleButtonClick(7);
                    }}
                    onMouseEnter={() => handleButtonHover(7)}
                    onMouseLeave={() => handleButtonLeave(7)}
                    disabled={isLoading}
                  >
                    <img src={sanrio} alt="sanrio" />
                    <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </div>
                  </button>

                  <button
                    ref={(el) => {
                      if (el) buttonsRef.current[8] = el;
                    }}
                    className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                    onClick={() => {
                      handleNext();
                      playClickSound();
                      handleButtonClick(8);
                    }}
                    onMouseEnter={() => handleButtonHover(8)}
                    onMouseLeave={() => handleButtonLeave(8)}
                    disabled={isLoading}
                  >
                    <img src={Forward} alt="forward" />
                    <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                      <SkipForward className="h-3 w-3" />
                    </div>
                  </button>
                </div>
                <button
                  ref={(el) => {
                    if (el) buttonsRef.current[9] = el;
                  }}
                  className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => {
                    handlePlaylistToggle();
                    handleButtonClick(9);
                  }}
                  onMouseEnter={() => handleButtonHover(9)}
                  onMouseLeave={() => handleButtonLeave(9)}
                  disabled={isLoading}
                >
                  <img src={PlaylistIcon} alt="Playlist Icon" />
                  <div className="absolute top-[20%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <List className="h-3 w-3" />
                  </div>
                </button>
              </div>

              <div className="w-full">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  className="cursor-pointer w-full"
                  onValueChange={handleSeek}
                  disabled={isLoading}
                  trackClassName="bg-[#ccf2fc]"
                  rangeClassName="bg-[#74defc]"
                  thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                  thumb={
                    <img
                      src={SliderIcon}
                      className="w-full h-full object-cover rounded-full"
                      alt={"sliderIcon"}
                    />
                  }
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(progress)}</span>
                  <span>{currentTrack.duration}</span>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

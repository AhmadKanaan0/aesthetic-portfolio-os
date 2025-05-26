import { useState, useEffect, useContext } from "react";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Loader2,
  Volume2,
  List,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import sanrio from "../assets/sanrio.png";
import Forward from "../assets/Forward.png";
import Previous from "../assets/Previous.png";
import MusicWallpaper from "../assets/MusicWallPaper.gif";
import SliderIcon from "../assets/SliderIcon.png";
import MusicPlayerImage from "../assets/MusicPlayerImage.png";
import PlaylistIcon from "../assets/PlaylistIcon.png";
import CinamonExit from "../assets/CinamonExit.png";
import { AudioContext } from "./audio-context";
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

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current) return;

      try {
        setIsLoading(true);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = currentTrack.src;

        await audioRef.current.load();

        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Autoplay failed:", error);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    };

    playAudio();
  }, [currentTrack]);

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
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  const changeTrack = (track: Track) => {
    setCurrentTrack(track);
    setProgress(0);
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
    const newTime = (audioRef.current.duration * value[0]) / 100;
    audioRef.current.currentTime = newTime;
    setProgress(value[0]);
  };

  const handleDesktopClose = () => {
    setIsExpanded(false);
    setShowPlaylist(false);
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
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          variant="ghost"
          className="w-20 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
          onClick={() => setIsExpanded(true)}
          disabled={isLoading}
        >
          <img src={MusicPlayerImage} alt="Music Player" />
          <motion.div
            className="absolute top-[77%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full overflow-hidden border-2 border-white/30"
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isPlaying
                ? {
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }
                : { duration: 0.5 }
            }
          >
            <img
              src={currentTrack.cover || "/placeholder.svg"}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </Button>
      </motion.div>
    );
  }

  // Desktop expanded panel
  if (isDesktop && isExpanded) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-cover bg-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{
          width: showPlaylist ? "480px" : "380px",
          height: "260px",
          backgroundImage: `url(${MusicWallpaper})`,
        }}
      >
        <div className="flex h-full w-full">
          {/* Main Player */}
          <motion.div
            className="flex-1 p-6 flex flex-col"
            animate={{
              x: showPlaylist ? -50 : 0,
              opacity: showPlaylist ? 0.8 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              duration: 0.3,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Now Playing
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => setShowPlaylist(!showPlaylist)}
                >
                  <img src={PlaylistIcon} alt="Playlist Icon" />
                  <div className="absolute top-[5%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <List className="h-4 w-4" />
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={handleDesktopClose}
                >
                  <img src={CinamonExit} alt="Cinamon Exit" />
                  <div className="absolute top-[60%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <X className="h-4 w-4" />
                  </div>
                </Button>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <motion.div
                className="w-20 h-20 rounded-xl overflow-hidden shadow-lg"
                animate={isPlaying ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <img
                  src={currentTrack.cover || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
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
              <Button
                variant="ghost"
                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={handlePrevious}
                disabled={isLoading}
              >
                <img src={Previous} alt="previous" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  <SkipBack className="h-6 w-6" />
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-18 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={handlePlayPause}
                disabled={isLoading}
              >
                <img src={sanrio} alt="sanrio" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={handleNext}
                disabled={isLoading}
              >
                <img src={Forward} alt="forward" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  <SkipForward className="h-6 w-6" />
                </div>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                className="cursor-pointer w-full flex-1"
                onValueChange={(value) => setVolume(value[0])}
                disabled={isLoading}
                trackClassName="bg-[#ccf2fc]"
                rangeClassName="bg-[#74defc]"
                thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                thumb={
                  <img
                    src={SliderIcon}
                    className="w-full h-full object-cover rounded-full"
                  />
                }
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                {volume}
              </span>
            </div>
          </motion.div>

          {/* Playlist Panel */}
          <AnimatePresence mode="wait">
            {showPlaylist && (
              <motion.div
                className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4"
                initial={{ x: 100, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 100, opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  duration: 0.3,
                }}
              >
                <h4 className="font-bold text-gray-800 dark:text-white mb-4">
                  Playlist
                </h4>
                <div className="space-y-2 overflow-y-scroll px-2 h-[200px]">
                  {playlist.map((track) => (
                    <motion.div
                      key={track.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                        currentTrack.id === track.id
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      onClick={() => changeTrack(track)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={track.cover || "/placeholder.svg"}
                        alt={track.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                          {track.artist}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {track.duration}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Mobile/Widget version with horizontal scrolling playlist
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="w-full h-[166px] rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${MusicWallpaper})` }}
        layout
      >
        <AnimatePresence mode="wait">
          {!showPlaylist ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 gap-4 flex flex-row items-center h-full"
            >
              <motion.div
                className={cn(
                  "w-32 h-32 rounded-2xl overflow-hidden shadow-md transform transition-transform",
                  isLoading ? "opacity-80" : "opacity-100"
                )}
                animate={
                  isPlaying && !isLoading
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <img
                  src={currentTrack.cover || "/placeholder.svg"}
                  alt={`${currentTrack.title} album cover`}
                  className="object-cover w-full h-full"
                />
              </motion.div>

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
                    <Button
                      variant="ghost"
                      className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={handlePrevious}
                      disabled={isLoading}
                    >
                      <img src={Previous} alt="previous" />
                      <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                        <SkipBack className="h-6 w-6" />
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-18 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={handlePlayPause}
                      disabled={isLoading}
                    >
                      <img src={sanrio} alt="sanrio" />
                      <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                        {isLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={handleNext}
                      disabled={isLoading}
                    >
                      <img src={Forward} alt="forward" />
                      <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                        <SkipForward className="h-6 w-6" />
                      </div>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                    onClick={() => setShowPlaylist(true)}
                    disabled={isLoading}
                  >
                    <img src={PlaylistIcon} alt="Playlist Icon" />
                    <div className="absolute top-[5%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                      <List className="h-4 w-4" />
                    </div>
                  </Button>
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
                      />
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(progress)}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="playlist"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-4 h-full flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Playlist
                </h3>
                <Button
                  variant="ghost"
                  className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => setShowPlaylist(false)}
                >
                  <img src={CinamonExit} alt="Cinamon Exit" />
                  <div className="absolute top-[60%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <X className="h-4 w-4" />
                  </div>
                </Button>
              </div>

              {/* Horizontal scrolling playlist */}
              <div className="flex-1 overflow-hidden">
                <div
                  className="flex gap-3 overflow-x-auto p-2 py-3 h-full"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {playlist.map((track) => (
                    <motion.div
                      key={track.id}
                      className={cn(
                        "flex flex-row gap-2 z-99 items-center bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 cursor-pointer transition-all duration-200 border",
                        currentTrack.id === track.id
                          ? "border-blue-400 bg-blue-100/30 dark:bg-blue-900/30"
                          : "border-white/20 hover:bg-white/30 dark:hover:bg-gray-700/50"
                      )}
                      onClick={() => {
                        changeTrack(track);
                        setShowPlaylist(false);
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-14 h-14 aspect-square rounded-lg overflow-hidden">
                        <img
                          src={track.cover || "/placeholder.svg"}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                          {track.artist}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {track.duration}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

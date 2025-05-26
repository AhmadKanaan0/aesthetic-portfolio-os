import { useState, useRef } from "react";
import {
  Heart,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Shuffle,
  Music2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// Sample playlist with real music src
const playlist = [
  {
    id: 1,
    title: "Bubblegum Dreams",
    artist: "Sweet Melody",
    duration: "3:24",
    cover: "/placeholder.svg?height=80&width=80",
    src: "/songs/bubblegum-dreams.mp3",
  },
  {
    id: 2,
    title: "Cotton Candy Skies",
    artist: "Pastel Tunes",
    duration: "2:56",
    cover: "/placeholder.svg?height=80&width=80",
    src: "/songs/cotton-candy-skies.mp3",
  },
  {
    id: 3,
    title: "Fluffy Clouds",
    artist: "Dreamy Notes",
    duration: "4:12",
    cover: "/placeholder.svg?height=80&width=80",
    src: "/songs/fluffy-clouds.mp3",
  },
  {
    id: 4,
    title: "Strawberry Beats",
    artist: "Berry Rhythms",
    duration: "3:45",
    cover: "/placeholder.svg?height=80&width=80",
    src: "/songs/strawberry-beats.mp3",
  },
  {
    id: 5,
    title: "Marshmallow Melodies",
    artist: "Sweet Harmony",
    duration: "3:18",
    cover: "/placeholder.svg?height=80&width=80",
    src: "/songs/marshmallow-melodies.mp3",
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(playlist[0]);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (track:any) => {
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.play();
    }
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    setCurrentTrack(nextTrack);
    setProgress(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = nextTrack.src;
      audioRef.current.play();
    }
  };

  const handlePrevious = () => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];
    setCurrentTrack(prevTrack);
    setProgress(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = prevTrack.src;
      audioRef.current.play();
    }
  };

  const formatTime = (progress:any) => {
    if (!audioRef.current || isNaN(audioRef.current.duration)) return "0:00";
    const totalSeconds = Math.floor(
      (audioRef.current.duration * progress) / 100
    );
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Album art and controls */}
        <div className="p-6 flex flex-col items-center">
          <div
            className={cn(
              "relative w-48 h-48 mb-6 rounded-2xl overflow-hidden shadow-md transform transition-transform",
              isPlaying && "animate-spin-slow"
            )}
          >
            <img
              src={currentTrack.cover || "/placeholder.svg"}
              alt={`${currentTrack.title} album cover`}
              className="object-cover"
            />
          </div>

          <div className="w-full mb-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">
              {currentTrack.title}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {currentTrack.artist}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full mb-6">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              className="cursor-pointer"
              onValueChange={(value) => {
                if (audioRef.current) {
                  const newTime = (audioRef.current.duration * value[0]) / 100;
                  audioRef.current.currentTime = newTime;
                }
                setProgress(value[0]);
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(progress)}</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-full"
              onClick={() => setLiked(!liked)}
            >
              <Heart className={cn("h-6 w-6", liked ? "fill-pink-600" : "")} />
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-full"
                onClick={handlePrevious}
              >
                <SkipBack className="h-6 w-6" />
              </Button>

              <Button
                variant="default"
                size="icon"
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full h-12 w-12 flex items-center justify-center"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-full"
                onClick={handleNext}
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-full"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
          </div>

          {/* Volume control */}
          <div className="flex items-center space-x-2 w-full">
            <Volume2 className="h-5 w-5 text-pink-600" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="flex-1"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>

        {/* Playlist */}
        <div className="bg-pink-50 rounded-b-3xl p-4">
          <div className="flex items-center mb-3">
            <Music2 className="h-4 w-4 text-pink-600 mr-2" />
            <h3 className="text-sm font-semibold text-pink-700">Playlist</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {playlist.map((track) => (
              <div
                key={track.id}
                className={cn(
                  "flex items-center p-2 rounded-xl cursor-pointer transition-colors",
                  currentTrack.id === track.id
                    ? "bg-pink-200 text-pink-800"
                    : "hover:bg-pink-100"
                )}
                onClick={() => handleTrackSelect(track)}
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden mr-3">
                  <img
                    src={track.cover || "/placeholder.svg"}
                    alt={`${track.title} album cover`}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {track.artist}
                  </p>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {track.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={() => {
          if (!audioRef.current) return;
          const newProgress =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(newProgress);
        }}
        onEnded={handleNext}
      />
    </div>
  );
}

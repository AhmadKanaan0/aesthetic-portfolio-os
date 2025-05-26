import BlueCover from "../assets/blue.jpg";
import BlueSong from "../assets/blue.mp4";
import LoveforYouCover from "../assets/LoveforYou.jpg";
import LoveforYouSong from "../assets/LoveforYou.mp4";
import LoveWaveToEarthCover from "../assets/Love-wavetoearth.jpg";
import LoveWaveToEarthSong from "../assets/Love-wavetoearth.mp4";
import GlueSongCover from "../assets/GlueSong.jpg";
import GlueSong from "../assets/GlueSong.mp4";

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  src: string;
}

export const playlist: Track[] = [
  {
    id: 1,
    title: "Blue",
    artist: "Yung kai",
    duration: "3:34",
    cover: BlueCover,
    src: BlueSong,
  },
  {
    id: 2,
    title: "Love For You",
    artist: "Loveli Lori",
    duration: "2:51",
    cover: LoveforYouCover,
    src: LoveforYouSong,
  },
  {
    id: 3,
    title: "Love",
    artist: "Wave To Earth",
    duration: "5:06",
    cover: LoveWaveToEarthCover,
    src: LoveWaveToEarthSong,
  },
  {
    id: 4,
    title: "Glue Song",
    artist: "Beabadoobee",
    duration: "2:16",
    cover: GlueSongCover,
    src: GlueSong,
  },
];
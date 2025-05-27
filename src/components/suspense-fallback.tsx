import { motion } from "motion/react";
import KuruKuru from "../assets/kurukuru.gif";

export function CuteSuspenseFallback() {
    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* "Kuru kuru" text above */}
        <motion.p
        className="text-3xl font-bold mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: [1, 1.05, 1],
          color: [
            '#bfdbfe', // lighter blue
            '#93c5fd', // medium light blue
            '#bfdbfe'  // lighter blue
          ],
          textShadow: [
            '0 0 5px #93c5fd',
            '0 0 15px #93c5fd',
            '0 0 5px #93c5fd'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          y: { duration: 0.3 }
        }}
      >
        Kuru kuru~
      </motion.p>
  
        {/* Static GIF */}
        <div className="w-100 h-100">
          <img
            src={KuruKuru}
            alt="Kuru kuru"
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>
    );
  }
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export default function Loader({
  text = "AI is thinking...",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="ai-orb"
      >
        <BrainCircuit
          size={28}
          className="relative z-10"
        />
      </motion.div>

      <motion.p
        animate={{
          opacity: [0.45, 1, 0.45],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
        className="mt-5 text-sm text-zinc-400"
      >
        {text}
      </motion.p>
    </div>
  );
}
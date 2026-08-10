import { motion } from "framer-motion";

export default function StatCard({
  icon,
  label,
  value,
  description,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
      }}
      className="
        glass-floating
        rounded-[26px]
        p-6
      "
    >
      <div className="flex items-center justify-between">
        <div
          className="
            w-11
            h-11
            rounded-2xl
            bg-white/[0.06]
            border
            border-white/[0.08]
            flex
            items-center
            justify-center
            text-blue-400
          "
        >
          {icon}
        </div>
      </div>

      <p className="text-sm text-zinc-500 mt-5">
        {label}
      </p>

      <p className="text-3xl font-extrabold mt-1 gradient-text">
        {value}
      </p>

      {description && (
        <p className="text-xs text-zinc-600 mt-2">
          {description}
        </p>
      )}
    </motion.div>
  );
}
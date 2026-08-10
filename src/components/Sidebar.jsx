import {
  LayoutDashboard,
  Upload,
  FileText,
  BrainCircuit,
  MessageCircle,
  Trophy,
  Sparkles,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Upload Project",
    path: "/upload",
    icon: Upload,
  },
  {
    name: "Upload Document",
    path: "/upload-document",
    icon: FileText,
  },
  {
    name: "Viva Room",
    path: "/viva",
    icon: BrainCircuit,
  },
  {
    name: "Project AI",
    path: "/project-chat",
    icon: MessageCircle,
  },
  {
    name: "Results",
    path: "/results",
    icon: Trophy,
  },
];

export default function Sidebar({
  mobileOpen = false,
  onClose,
}) {
  return (
    <>
      {/* =====================================================
          MOBILE BACKDROP
          ===================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-40
              bg-black/60
              backdrop-blur-sm
              lg:hidden
            "
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <motion.aside
        initial={false}
        animate={{
          x: mobileOpen ? 0 : -320,
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed

          left-4
          top-4
          bottom-4

          z-50

          w-[270px]

          glass-floating
          glass-reflection

          rounded-[30px]

          p-4

          flex
          flex-col

          overflow-hidden

          lg:translate-x-0
        "
      >
        {/* ===================================================
            BRAND
            =================================================== */}

        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-3">
            <div
              className="
                ai-orb
                !w-11
                !h-11
                !rounded-[15px]
                shrink-0
              "
            >
              <Sparkles size={20} />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight">
                VivaAI
              </h1>

              <p className="text-[11px] text-white/40 font-medium">
                Defense Simulator
              </p>
            </div>
          </div>

          {/* Mobile close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="
              glass-button

              !min-h-9
              !w-9
              !h-9
              !p-0

              lg:hidden
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* ===================================================
            DIVIDER
            =================================================== */}

        <div className="my-5 h-px bg-white/[0.06]" />

        {/* ===================================================
            NAVIGATION TITLE
            =================================================== */}

        <p
          className="
            px-3
            mb-3

            text-[10px]
            uppercase
            tracking-[0.2em]

            text-white/30
            font-bold
          "
        >
          Workspace
        </p>

        {/* ===================================================
            NAVIGATION
            =================================================== */}

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={18} />

                <span className="text-sm font-semibold">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* ===================================================
            BOTTOM SYSTEM STATUS
            =================================================== */}

        <div className="mt-auto">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <span className="status-dot" />

              <span className="text-xs font-bold">
                AI System Online
              </span>
            </div>

            <p className="mt-2 text-[11px] text-white/35">
              Gemini-powered project defense
            </p>
          </div>

          <div className="px-3 pt-4">
            <p className="text-[10px] text-white/20">
              VivaAI
            </p>

            <p className="text-[10px] text-white/15">
              Academic Defense Platform
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
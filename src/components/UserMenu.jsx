import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";

import {
  useAuth,
} from "../context/AuthContext";


export default function UserMenu() {
  const {
    user,
    logout,
  } = useAuth();

  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef(null);


  /*
  =========================================
  CLOSE WHEN CLICKING OUTSIDE
  =========================================
  */

  useEffect(() => {
    const handleOutside =
      (event) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(
            event.target
          )
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);


  /*
  =========================================
  LOGOUT
  =========================================
  */

  const handleLogout =
    async () => {
      try {
        await logout();
        setOpen(false);
      } catch (error) {
        console.error(
          "Logout failed:",
          error
        );
      }
    };


  if (!user) {
    return null;
  }


  const name =
    user.displayName ||
    "Google User";

  const email =
    user.email ||
    "";

  const photo =
    user.photoURL ||
    "";


  return (
    <div
      ref={menuRef}
      className="relative"
    >

      {/* PROFILE BUTTON */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) => !value
          )
        }
        className="
          flex
          items-center
          gap-2
          h-10
          pl-1
          pr-2.5
          rounded-full
          border
          border-white/[0.08]
          bg-white/[0.035]
          hover:bg-white/[0.07]
          transition-all
        "
      >

        {photo ? (
          <img
            src={photo}
            alt={name}
            className="
              w-8
              h-8
              rounded-full
              object-cover
              border
              border-white/10
            "
          />
        ) : (
          <div
            className="
              w-8
              h-8
              rounded-full
              bg-gradient-to-br
              from-violet-500
              to-purple-700
              flex
              items-center
              justify-center
            "
          >
            <UserRound
              size={16}
            />
          </div>
        )}

        <div className="hidden md:block text-left max-w-[130px]">

          <p className="
            text-xs
            font-bold
            text-white
            truncate
          ">
            {name}
          </p>

          <p className="
            text-[10px]
            text-white/35
            truncate
          ">
            {email}
          </p>

        </div>

        <ChevronDown
          size={14}
          className={`
            text-white/40
            transition-transform
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />

      </button>


      {/* DROPDOWN */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+10px)]
            z-[9999]
            w-[270px]
            rounded-[20px]
            border
            border-white/[0.08]
            bg-[#111116]
            shadow-[0_25px_70px_rgba(0,0,0,0.6)]
            overflow-hidden
          "
        >

          {/* USER */}

          <div className="p-4">

            <div className="
              flex
              items-center
              gap-3
            ">

              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className="
                    w-11
                    h-11
                    rounded-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-gradient-to-br
                    from-violet-500
                    to-purple-700
                    flex
                    items-center
                    justify-center
                  "
                >
                  <UserRound
                    size={19}
                  />
                </div>
              )}

              <div className="min-w-0">

                <p className="
                  text-sm
                  font-bold
                  text-white
                  truncate
                ">
                  {name}
                </p>

                <p className="
                  text-xs
                  text-white/40
                  truncate
                  mt-0.5
                ">
                  {email}
                </p>

              </div>

            </div>

          </div>


          <div className="
            h-px
            bg-white/[0.06]
          " />


          {/* STATUS */}

          <div className="px-4 py-3">

            <div className="
              flex
              items-center
              gap-2
            ">

              <span className="
                w-2
                h-2
                rounded-full
                bg-emerald-400
                shadow-[0_0_10px_rgba(52,211,153,0.7)]
              " />

              <span className="
                text-xs
                text-white/50
              ">
                Google account connected
              </span>

            </div>

          </div>


          <div className="
            h-px
            bg-white/[0.06]
          " />


          {/* LOGOUT */}

          <div className="p-2">

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                text-red-300
                hover:bg-red-500/10
                transition
              "
            >

              <LogOut
                size={17}
              />

              Sign out

            </button>

          </div>

        </div>
      )}

    </div>
  );
}
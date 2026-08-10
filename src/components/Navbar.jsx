import {
  Menu,
  Bell,
  Sparkles,
  UserRound,
  ChevronDown,
  LogIn,
  LogOut,
  Loader2,
  Cpu,
  Coins,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase";

import {
  useAuth,
} from "../context/AuthContext";


const titles = {
  "/": "Dashboard",
  "/upload": "Upload Project",
  "/upload-document": "Project Document",
  "/viva": "AI Viva Room",
  "/project-chat": "Project AI",
  "/results": "Performance Results",
};


const API_BASE =
  "https://vivaai-backend-9dwn.onrender.com";


export default function Navbar({
  onMenu,
}) {

  const location =
    useLocation();

  const {
    user,
    logout,
    loading,
  } = useAuth();


  const [profileOpen, setProfileOpen] =
    useState(false);

  const [signingIn, setSigningIn] =
    useState(false);

  const [signingOut, setSigningOut] =
    useState(false);


  const [usage, setUsage] =
    useState(null);

  const [usageLoading, setUsageLoading] =
    useState(false);


  const profileRef =
    useRef(null);


  const title =
    titles[location.pathname] ||
    "VivaAI";


  /*
  =========================================================
  CLOSE MENU WHEN CLICKING OUTSIDE
  =========================================================
  */

  useEffect(() => {

    const handleOutsideClick =
      (event) => {

        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {

          setProfileOpen(false);
        }
      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  /*
  =========================================================
  GET TOKEN USAGE
  =========================================================
  */

  const loadUsage =
    async () => {

      try {

        setUsageLoading(true);


        const response =
          await fetch(
            `${API_BASE}/api/usage`
          );


        if (!response.ok) {

          throw new Error(
            `Usage API returned ${response.status}`
          );
        }


        const data =
          await response.json();


        if (
          data.success &&
          data.usage
        ) {

          setUsage(
            data.usage
          );

        }

      } catch (error) {

        console.error(
          "Failed to load token usage:",
          error
        );

      } finally {

        setUsageLoading(false);

      }
    };


  /*
  =========================================================
  LOAD USAGE WHEN USER IS LOGGED IN
  =========================================================
  */

  useEffect(() => {

    if (!user) {

      setUsage(null);

      return;
    }


    loadUsage();


    /*
    Refresh usage every 30 seconds.
    */

    const interval =
      setInterval(
        loadUsage,
        30000
      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, [user]);


  /*
  =========================================================
  GOOGLE SIGN IN
  =========================================================
  */

  const handleGoogleSignIn =
    async () => {

      if (signingIn) {
        return;
      }


      try {

        setSigningIn(true);


        googleProvider.setCustomParameters({
          prompt:
            "select_account",
        });


        await signInWithPopup(
          auth,
          googleProvider
        );


        console.log(
          "Google sign-in successful"
        );

      } catch (error) {

        console.error(
          "Google sign-in failed:",
          error
        );


        if (
          error?.code !==
          "auth/popup-closed-by-user"
        ) {

          alert(
            "Google sign-in failed. Please try again."
          );
        }

      } finally {

        setSigningIn(false);

      }
    };


  /*
  =========================================================
  SIGN OUT
  =========================================================
  */

  const handleSignOut =
    async () => {

      if (signingOut) {
        return;
      }


      try {

        setSigningOut(true);

        setProfileOpen(false);

        await logout();

        setUsage(null);

      } catch (error) {

        console.error(
          "Sign out failed:",
          error
        );

      } finally {

        setSigningOut(false);

      }
    };


  /*
  =========================================================
  USER DETAILS
  =========================================================
  */

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Google User";


  const userEmail =
    user?.email ||
    "";


  const firstLetter =
    userName
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";


  /*
  =========================================================
  USAGE VALUES
  =========================================================
  */

  const totalUsed =
    usage?.totalTokens || 0;


  const monthlyLimit =
    usage?.monthlyLimit || 100000;


  const remaining =
    usage?.remainingTokens ??
    Math.max(
      0,
      monthlyLimit -
        totalUsed
    );


  const percentage =
    usage?.percentageUsed ??
    0;


  const inputTokens =
    usage?.inputTokens || 0;


  const outputTokens =
    usage?.outputTokens || 0;


  /*
  =========================================================
  USAGE STATUS
  =========================================================
  */

  let usageStatus =
    "normal";


  if (
    percentage >= 90
  ) {

    usageStatus =
      "critical";

  } else if (
    percentage >= 70
  ) {

    usageStatus =
      "warning";
  }


  const usageBarClass =
    usageStatus === "critical"
      ? "bg-red-500"
      : usageStatus === "warning"
        ? "bg-yellow-400"
        : "bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500";


  return (

    <header
      className="
        fixed
        z-40

        top-4
        left-4
        right-4

        lg:left-[310px]
        lg:right-6

        h-[72px]

        glass-nav
        rounded-[24px]

        flex
        items-center
        justify-between

        px-4
        sm:px-5

        shadow-2xl
      "
    >

      {/* =================================================
          LEFT
      ================================================= */}

      <div className="
        flex
        items-center
        gap-3
        min-w-0
      ">

        <button
          onClick={onMenu}
          className="
            glass-button
            !w-11
            !h-11
            !min-h-11
            !p-0
            rounded-[15px]
            shrink-0
          "
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>


        <div className="min-w-0">

          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.22em]
              text-white/30
              font-black
            "
          >
            VivaAI
          </p>


          <h2
            className="
              font-bold
              text-sm
              sm:text-base
              leading-tight
              truncate
            "
          >
            {title}
          </h2>

        </div>

      </div>


      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="
        flex
        items-center
        gap-2
      ">


        {/* AI STATUS */}

        <div
          className="
            hidden
            sm:flex
            items-center
            gap-2

            rounded-full
            px-3
            py-2

            bg-white/[0.035]
            border
            border-white/[0.07]

            backdrop-blur-xl
          "
        >

          <span
            className="
              status-dot
              !w-1.5
              !h-1.5
            "
          />

          <span className="
            text-xs
            text-white/55
            font-medium
          ">
            AI Online
          </span>

        </div>


        {/* NOTIFICATION */}

        <button
          className="
            glass-button
            !w-10
            !h-10
            !min-h-10
            !p-0
            rounded-full
          "
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>


        {/* =================================================
            AUTH
        ================================================= */}

        {loading ? (

          <div
            className="
              h-10
              min-w-10
              px-3
              rounded-full

              flex
              items-center
              justify-center

              bg-white/[0.035]
              border
              border-white/[0.08]
            "
          >

            <Loader2
              size={17}
              className="
                animate-spin
                text-white/50
              "
            />

          </div>

        ) : !user ? (

          /* SIGN IN */

          <button
            onClick={
              handleGoogleSignIn
            }
            disabled={signingIn}
            className="
              h-10

              flex
              items-center
              gap-2

              px-3
              sm:px-4

              rounded-full

              bg-gradient-to-r
              from-blue-500
              via-purple-500
              to-fuchsia-500

              text-white
              text-xs
              font-bold

              shadow-lg
              shadow-purple-500/20

              hover:scale-[1.02]
              active:scale-[0.98]

              transition-all

              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >

            {signingIn ? (

              <Loader2
                size={16}
                className="
                  animate-spin
                "
              />

            ) : (

              <LogIn
                size={16}
              />

            )}


            <span className="
              hidden
              sm:inline
            ">
              {signingIn
                ? "Signing in..."
                : "Sign in"}
            </span>

          </button>

        ) : (

          /* =================================================
             LOGGED IN
          ================================================= */

          <div
            ref={profileRef}
            className="relative"
          >

            <button
              onClick={() =>
                setProfileOpen(
                  (previous) =>
                    !previous
                )
              }
              className="
                h-10

                flex
                items-center
                gap-2

                pl-1
                pr-2

                rounded-full

                bg-white/[0.035]
                border
                border-white/[0.08]

                hover:bg-white/[0.07]

                transition-all
              "
            >

              {user.photoURL ? (

                <img
                  src={
                    user.photoURL
                  }
                  alt={userName}
                  className="
                    w-8
                    h-8
                    rounded-full
                    object-cover
                    border
                    border-white/10
                  "
                  referrerPolicy="no-referrer"
                />

              ) : (

                <div
                  className="
                    w-8
                    h-8
                    rounded-full

                    bg-gradient-to-br
                    from-blue-500
                    to-purple-600

                    flex
                    items-center
                    justify-center

                    text-xs
                    font-bold
                  "
                >
                  {firstLetter}
                </div>

              )}


              <div className="
                hidden
                md:block
                text-left
                max-w-[130px]
              ">

                <p className="
                  text-xs
                  font-bold
                  text-white/80
                  truncate
                ">
                  {userName}
                </p>

              </div>


              <ChevronDown
                size={14}
                className={`
                  text-white/40
                  transition-transform
                  ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            {/* =================================================
                DROPDOWN
            ================================================= */}

            {profileOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]

                  w-[320px]

                  rounded-[22px]

                  bg-[#111117]

                  border
                  border-white/[0.09]

                  shadow-2xl
                  shadow-black/50

                  overflow-hidden

                  backdrop-blur-2xl
                "
              >

                {/* USER */}

                <div className="p-4">

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">

                    {user.photoURL ? (

                      <img
                        src={
                          user.photoURL
                        }
                        alt={userName}
                        className="
                          w-11
                          h-11
                          rounded-full
                          object-cover
                        "
                        referrerPolicy="no-referrer"
                      />

                    ) : (

                      <div
                        className="
                          w-11
                          h-11
                          rounded-full

                          bg-gradient-to-br
                          from-blue-500
                          to-purple-600

                          flex
                          items-center
                          justify-center

                          font-bold
                        "
                      >
                        {firstLetter}
                      </div>

                    )}


                    <div className="min-w-0">

                      <p className="
                        text-sm
                        font-bold
                        text-white
                        truncate
                      ">
                        {userName}
                      </p>


                      <p className="
                        text-xs
                        text-white/35
                        truncate
                        mt-0.5
                      ">
                        {userEmail}
                      </p>

                    </div>

                  </div>

                </div>


                <div className="
                  h-px
                  bg-white/[0.07]
                " />


                {/* =================================================
                    TOKEN USAGE
                ================================================= */}

                <div className="p-4">

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-3
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2
                    ">

                      <div
                        className="
                          w-8
                          h-8
                          rounded-xl

                          bg-purple-500/10

                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Cpu
                          size={16}
                          className="
                            text-purple-400
                          "
                        />

                      </div>


                      <div>

                        <p className="
                          text-xs
                          font-bold
                          text-white/80
                        ">
                          AI Token Usage
                        </p>

                        <p className="
                          text-[10px]
                          text-white/30
                        ">
                          Monthly allowance
                        </p>

                      </div>

                    </div>


                    <Coins
                      size={16}
                      className="
                        text-white/25
                      "
                    />

                  </div>


                  {usageLoading &&
                  !usage ? (

                    <div className="
                      flex
                      items-center
                      justify-center
                      py-5
                    ">

                      <Loader2
                        size={18}
                        className="
                          animate-spin
                          text-purple-400
                        "
                      />

                    </div>

                  ) : usage ? (

                    <>

                      {/* TOTAL */}

                      <div className="
                        flex
                        items-end
                        justify-between
                        mb-2
                      ">

                        <div>

                          <p className="
                            text-2xl
                            font-black
                            tracking-tight
                            text-white
                          ">
                            {totalUsed.toLocaleString()}
                          </p>

                          <p className="
                            text-[10px]
                            text-white/30
                          ">
                            tokens used
                          </p>

                        </div>


                        <p className="
                          text-xs
                          font-bold
                          text-white/40
                        ">
                          {monthlyLimit.toLocaleString()}
                        </p>

                      </div>


                      {/* PROGRESS BAR */}

                      <div className="
                        h-2
                        rounded-full
                        bg-white/[0.06]
                        overflow-hidden
                      ">

                        <div
                          className={`
                            h-full
                            rounded-full
                            transition-all
                            duration-500
                            ${usageBarClass}
                          `}
                          style={{
                            width:
                              `${Math.min(
                                percentage,
                                100
                              )}%`,
                          }}
                        />

                      </div>


                      {/* REMAINING */}

                      <div className="
                        flex
                        items-center
                        justify-between
                        mt-2
                      ">

                        <p
                          className={`
                            text-[10px]
                            font-semibold
                            ${
                              usageStatus ===
                              "critical"
                                ? "text-red-400"
                                : usageStatus ===
                                    "warning"
                                  ? "text-yellow-400"
                                  : "text-white/35"
                            }
                          `}
                        >

                          {remaining.toLocaleString()}
                          {" "}
                          remaining

                        </p>


                        <p className="
                          text-[10px]
                          text-white/25
                        ">
                          {percentage}%
                        </p>

                      </div>


                      {/* INPUT / OUTPUT */}

                      <div className="
                        grid
                        grid-cols-2
                        gap-2
                        mt-4
                      ">

                        <div className="
                          rounded-xl
                          bg-white/[0.025]
                          border
                          border-white/[0.05]
                          p-3
                        ">

                          <p className="
                            text-[9px]
                            uppercase
                            tracking-wider
                            text-white/25
                          ">
                            Input
                          </p>

                          <p className="
                            mt-1
                            text-xs
                            font-bold
                            text-white/65
                          ">
                            {inputTokens.toLocaleString()}
                          </p>

                        </div>


                        <div className="
                          rounded-xl
                          bg-white/[0.025]
                          border
                          border-white/[0.05]
                          p-3
                        ">

                          <p className="
                            text-[9px]
                            uppercase
                            tracking-wider
                            text-white/25
                          ">
                            Output
                          </p>

                          <p className="
                            mt-1
                            text-xs
                            font-bold
                            text-white/65
                          ">
                            {outputTokens.toLocaleString()}
                          </p>

                        </div>

                      </div>


                      {/* WARNING */}

                      {usageStatus ===
                        "warning" && (

                        <div className="
                          mt-3
                          rounded-xl
                          bg-yellow-400/5
                          border
                          border-yellow-400/10
                          px-3
                          py-2.5
                        ">

                          <p className="
                            text-[10px]
                            leading-4
                            text-yellow-300/80
                          ">
                            ⚠️ You have used more
                            than 70% of your monthly
                            AI token allowance.
                          </p>

                        </div>

                      )}


                      {usageStatus ===
                        "critical" && (

                        <div className="
                          mt-3
                          rounded-xl
                          bg-red-500/5
                          border
                          border-red-500/10
                          px-3
                          py-2.5
                        ">

                          <p className="
                            text-[10px]
                            leading-4
                            text-red-300/80
                          ">
                            ⚠️ Your AI token
                            allowance is almost
                            exhausted.
                          </p>

                        </div>

                      )}

                    </>

                  ) : (

                    <div className="
                      rounded-xl
                      bg-white/[0.025]
                      p-3
                    ">

                      <p className="
                        text-xs
                        text-white/35
                      ">
                        Usage information
                        unavailable.
                      </p>

                    </div>

                  )}

                </div>


                <div className="
                  h-px
                  bg-white/[0.07]
                " />


                {/* SIGN OUT */}

                <div className="p-2">

                  <button
                    onClick={
                      handleSignOut
                    }
                    disabled={
                      signingOut
                    }
                    className="
                      w-full

                      flex
                      items-center
                      gap-3

                      px-3
                      py-3

                      rounded-[14px]

                      text-left

                      hover:bg-red-500/[0.08]

                      transition

                      disabled:opacity-50
                    "
                  >

                    <div
                      className="
                        w-9
                        h-9
                        rounded-full

                        flex
                        items-center
                        justify-center

                        bg-red-500/10
                      "
                    >

                      {signingOut ? (

                        <Loader2
                          size={16}
                          className="
                            text-red-400
                            animate-spin
                          "
                        />

                      ) : (

                        <LogOut
                          size={16}
                          className="
                            text-red-400
                          "
                        />

                      )}

                    </div>


                    <div>

                      <p className="
                        text-sm
                        font-semibold
                        text-red-400
                      ">
                        {signingOut
                          ? "Signing out..."
                          : "Sign out"}
                      </p>

                      <p className="
                        text-[10px]
                        text-white/25
                        mt-0.5
                      ">
                        Sign out of this account
                      </p>

                    </div>

                  </button>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </header>
  );
}
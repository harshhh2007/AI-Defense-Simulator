import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import Dashboard from "./pages/Dashboard";
import UploadProject from "./pages/UploadProject";
import VivaRoom from "./pages/VivaRoom";
import Results from "./pages/Results";
import UploadDocument from "./pages/UploadDocument";
import ProjectChat from "./pages/ProjectChat";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";


function PageWrapper({
  children,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}


function ProtectedPage({
  children,
}) {
  return (
    <ProtectedRoute>
      <PageWrapper>
        {children}
      </PageWrapper>
    </ProtectedRoute>
  );
}


function AppRoutes() {

  const location =
    useLocation();


  return (
    <AnimatePresence
      mode="wait"
    >
      <Routes
        location={location}
        key={location.pathname}
      >

        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />


        {/* =================================================
            UPLOAD
        ================================================= */}

        <Route
          path="/upload"
          element={
            <ProtectedPage>
              <UploadProject />
            </ProtectedPage>
          }
        />


        {/* =================================================
            DOCUMENT
        ================================================= */}

        <Route
          path="/upload-document"
          element={
            <ProtectedPage>
              <UploadDocument />
            </ProtectedPage>
          }
        />


        {/* =================================================
            VIVA
        ================================================= */}

        <Route
          path="/viva"
          element={
            <ProtectedPage>
              <VivaRoom />
            </ProtectedPage>
          }
        />


        {/* =================================================
            PROJECT AI
        ================================================= */}

        <Route
          path="/project-chat"
          element={
            <ProtectedPage>
              <ProjectChat />
            </ProtectedPage>
          }
        />


        {/* =================================================
            RESULTS
        ================================================= */}

        <Route
          path="/results"
          element={
            <ProtectedPage>
              <Results />
            </ProtectedPage>
          }
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

      </Routes>
    </AnimatePresence>
  );
}


export default function App() {
  return <AppRoutes />;
}
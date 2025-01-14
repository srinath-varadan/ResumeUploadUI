import styles from "./style";
import { useCallback, useEffect, useState } from "react";
import { Navbar, Home, Upload, Start } from "./components";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import Search from "./pages/Search/Search";
import Details from "./pages/Details/Details";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>

        <div className={`bg-primary ${styles.flexStart}`}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={"light"}
            transition={Bounce}
          />
          <div className={`${styles.boxWidth}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route
                path="/upload"
                element={<Upload setIsLoading={setIsLoading} />}
              />
              <Route path="/start" element={<Start />} />
              <Route path="/search" element={<Search />} />
              <Route path="/details/:id" element={<Details />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

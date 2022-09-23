import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import UserManager from "./pages/home";
import "./App.css";
import "antd/dist/antd.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeDetail from "./pages/components/HomeDetail/HomeDetail";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<UserManager />} />
          <Route path="home/:id" element={<HomeDetail />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;

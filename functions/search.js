import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { BsFillKeyboardFill } from "react-icons/bs";
import { auth } from "../firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Header = ({ isShow }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [dropMenu, setDropMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    const fetchCaptions = async () => {
      try {
        const captionsSnapshot = await getDocs(collection(db, "captions"));
        const captionsData = captionsSnapshot.docs.map((doc) => doc.data().caption);
        setCaptions(captionsData);
      } catch (error) {
        console.error("Error fetching captions:", error);
      }
    };

    fetchCaptions();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== "") {
      // Tìm kiếm trong dữ liệu phụ đề
      const filteredCaptions = captions.filter((caption) =>
        caption.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // Chỉ điều hướng khi có kết quả tìm kiếm
      if (filteredCaptions.length > 0) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <header>
      <nav className="navbar">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <img
            className="logo"
            onClick={() => router.push("/")}
            src="https://i.postimg.cc/W1PwRj4j/logo.png"
            alt="Tiktok"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="search-bar"
        >
          <input
            type="text"
            className="search-input"
            placeholder="Search accounts and videos"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button className="search-btn" onClick={handleSearchSubmit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </motion.div>

        {/* Rest of your header component */}
      </nav>
    </header>
  );
};

export default Header;

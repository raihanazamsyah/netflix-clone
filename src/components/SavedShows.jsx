import React, { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { AiOutlineClose } from "react-icons/ai";

const SavedShows = () => {
  const [movies, setMovies] = useState([]);
  const { user } = UserAuth();
  const slideLeft = () => {
    let slider = document.getElementById("slider");
    slider.scrollLeft = slider.screenLeft - 500;
  };

  const slideRight = () => {
    let slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setMovies(doc.data()?.savedShows);
    });
  }, [user?.email]);

  const movieRef = doc(db, "users", `${user?.email}`);
  const deleteShow = async (passedID) => {
    try {
      const result = movies.filter((item) => item.id !== passedID);
      await updateDoc(movieRef, {
        savedShows: result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className="p-4 font-bold text-white md:text-xl">My Shows</h2>
      <div className="relative flex items-center group">
        <MdChevronLeft
          onClick={slideLeft}
          className="absolute left-0 z-10 hidden bg-gray-300 rounded-full cursor-pointer opacity-40 hover:opacity-100 group-hover:block"
          size={40}
        />
        <div
          id={"slider"}
          className="relative w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide"
        >
          {movies.map((item, id) => (
            <div
              key={id}
              className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2 "
            >
              <img
                className="block w-full h-auto"
                src={`https://image.tmdb.org/t/p/w500/${item?.img}`}
                alt={item?.title}
              />
              <div className="absolute top-0 left-0 w-full h-full text-white opacity-0 hover:opacity-100 hover:bg-black/80">
                <p className="flex items-center justify-center h-full text-xs font-bold text-center white-space-normal">
                  {item?.title}
                </p>
                <p
                  onClick={() => deleteShow(item.id)}
                  className="absolute text-gray-300 top-4 right-4"
                >
                  <AiOutlineClose />
                </p>
              </div>
            </div>
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          className="absolute right-0 z-10 hidden bg-gray-300 rounded-full cursor-pointer opacity-40 hover:opacity-100 group-hover:block"
          size={40}
        />
      </div>
    </>
  );
};

export default SavedShows;

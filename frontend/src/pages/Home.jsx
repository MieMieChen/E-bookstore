import {BooksExhibition} from "../components/BooksExhibition";
import {AdminBooks} from "../components/AdminBooks";
import React from "react";
import{useAuth} from "../context/AuthContext";
export  function Home (){
  const {currentUser} = useAuth();
  const isAdmin = currentUser.type;
  // const isAdmin = 1;

  return (
    isAdmin ? (
            <div>
                <AdminBooks/>
            </div>
        ) : (
            <div>
                <BooksExhibition />
            </div>
        )

  );
};
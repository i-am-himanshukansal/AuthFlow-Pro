import React, { useContext } from "react";
import Hero from "../components/Hero";
import Creator from "../components/Creator";
import Technologies from "../components/Technologies";
import "../styles/Home.css";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Footer from "../layout/Footer";
import Navbar from "../components/Navbar";

const Home = () => {
  const { isAuthenticated } = useContext(Context);

  // protect home route
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Navbar />
      <section className="home">
        <Hero />
        <Creator />
        <Technologies />
        <Footer />
      </section>
    </>
  );
};

export default Home;

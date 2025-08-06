import React from "react";

const About = () => {
  return (
    <div className="bg-off-white-light dark:bg-brown-dark text-brown-dark dark:text-off-white py-12 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">About PenToPublic</h1>
        <p className="text-lg leading-7">
          PenToPublic is your creative publishing platform, designed to empower authors and readers alike.
          Whether you're a budding writer or an enthusiastic reader, our platform connects words to hearts.
        </p>
        <p className="mt-4 text-lg">
          We believe in giving everyone the power to share their voice with the world — be it through stories, poems, or knowledge.
        </p>
      </div>
    </div>
  );
};

export default About;

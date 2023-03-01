import { useState, useEffect } from "react";
import "./App.css";

import VideoCard from "./components/VideoCard";

function App() {
  const [videos, setvideos] = useState([]);

  const getVideos = (length) => {
    let newVideos = Array.from(Array(length).keys());
    setvideos((oldVideos) => [...oldVideos, ...newVideos]);
  };

  useEffect(() => {
    getVideos(3);
  }, []);

  return (
    <main>
      <div className="slider-container">
        {videos.length > 0 ? (
          <>
            {videos.map((video, id) => (
              <VideoCard key={id} index={id + 1} />
            ))}
          </>
        ) : (
          <>
            <h1>Nothing to show here</h1>
          </>
        )}
      </div>
    </main>
  );
}

export default App;

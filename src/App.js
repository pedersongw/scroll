import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import "./App.css";

import VideoCard from "./components/VideoCard";

function App() {
  const [previousVideos, setPreviousVideos] = useState([]);
  const [videos, setvideos] = useState({ videos: [], scrollChange: 0 });
  const [laterVideos, setLaterVideos] = useState([]);

  const [scroll, setScroll] = useState();

  const firstUpdate = useRef(true);
  const scrollContainer = useRef();

  useEffect(() => {
    getVideos(3);
  }, []);

  const changeScroll = useCallback((event) => {
    console.log(event.target.scrollTop);
    setScroll(event.target.scrollTop);
  }, []);

  useLayoutEffect(() => {
    console.log(previousVideos, videos.videos, laterVideos);
    if (videos.videos.length > 0 && firstUpdate.current) {
      scrollContainer.current.scrollTop = 0;
      firstUpdate.current = false;
    } else if (!firstUpdate.current && videos.scrollChange < 0) {
      scrollContainer.current.scrollTop = scroll + videos.scrollChange;

      scrollContainer.current.removeEventListener("scroll", changeScroll, true);
    } else if (!firstUpdate.current && videos.scrollChange > 0) {
    }
  }, [videos]);

  const getVideos = (length) => {
    console.log(previousVideos, videos.videos, laterVideos);
    let prevVids = [...previousVideos];
    let newVideos = [...videos.videos];
    let laterVids = [...laterVideos];

    let height = 0;
    if (laterVideos.length > 0) {
      if (laterVideos.length >= length) {
        newVideos.push(...laterVids.splice(0, length));
      } else {
        let vids = [...laterVids.splice(0)];
        for (let i = 0; i < length - vids.length; i++) {
          vids.push(Math.floor(Math.random() * 100));
        }
        newVideos.push(...vids);
      }
    } else {
      for (let i = 0; i < length; i++) {
        newVideos.push(Math.floor(Math.random() * 100));
      }
    }
    if (newVideos.length > 25) {
      console.log("videos length", newVideos.length);

      for (let i = 0; i < newVideos.length - 25; i++) {
        console.log("height loop");
        let childHeight =
          scrollContainer.current.children[i].getBoundingClientRect().height;

        height = height + childHeight;
      }
      let videosToRemoveFromTop = newVideos.splice(0, newVideos.length - 25);
      setScroll(scrollContainer.current.scrollTop);
      scrollContainer.current.addEventListener("scroll", changeScroll, true);

      prevVids.push(...videosToRemoveFromTop);
    }
    if (height > 0) {
      height = -Math.abs(height);
    }

    setvideos({
      videos: [...newVideos],
      scrollChange: height,
    });
    setPreviousVideos(prevVids);
    setLaterVideos(laterVids);
  };

  const getPreviousVideos = (length) => {
    let newVideos = [...videos.videos];
    let videosToRemoveFromBottom;
    let height = 0;

    let previousVids;
    if (previousVideos.length > 0) {
      previousVids = [...previousVideos];
      if (previousVids.length >= length) {
        let videosToBeAdded = previousVids.splice(
          previousVids.length - length,
          length
        );

        newVideos.unshift(...videosToBeAdded);
        height = length;
      } else {
        height = previousVids.length;
        newVideos.unshift(...previousVids);
        previousVids = [];
      }

      setScroll(scrollContainer.current.scrollTop);
      scrollContainer.current.addEventListener("scroll", changeScroll, true);
    }

    if (newVideos.length > 25) {
      videosToRemoveFromBottom = newVideos.splice(25);
    }
    if (videosToRemoveFromBottom) {
      setLaterVideos((videos) => {
        return [...videosToRemoveFromBottom, ...videos];
      });
    }

    if (previousVids) {
      setPreviousVideos(previousVids);
    }
    setvideos({
      videos: [...newVideos],
      scrollChange: height,
    });
  };

  return (
    <main>
      <div className="slider-container" ref={scrollContainer}>
        <div className="absolute">
          <div className="absolute-child" onClick={() => getPreviousVideos(3)}>
            P
          </div>
          <div className="absolute-child" onClick={() => getVideos(3)}>
            L
          </div>
          <div
            className="absolute-child"
            onClick={() => console.log(previousVideos, videos, laterVideos)}
          >
            =
          </div>
        </div>
        {videos ? (
          <>
            {videos.videos.map((video, index) => (
              <VideoCard key={index} index={video} />
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

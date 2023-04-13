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

  const [scrollContainerHeight, setScrollContainerHeight] = useState();
  const [scroll, setScroll] = useState();

  const firstUpdate = useRef(true);
  const scrollContainer = useRef(null);

  useEffect(() => {
    if (firstUpdate.current) {
      console.log("first update");
      scrollContainer.current.scrollTop = 0;
      setScroll(0);
      setScrollContainerHeight(scrollContainer.current.scrollHeight);
      firstUpdate.current = false;
    }
    getVideos(3);
  }, []);

  // const changeScroll = useCallback((event) => {
  //   console.log(event.target.scrollTop);``
  //   setScroll(event.target.scrollTop);
  // }, []);

  const updateScroll = useCallback((event) => {
    setScroll(event.currentTarget.scrollTop);
    console.log("update scroll", event.currentTarget.scrollTop);
  }, []);

  const resizeHandler = useCallback(() => {
    let newScrollTop =
      (scroll / scrollContainerHeight) * scrollContainer.current.scrollHeight;
    scrollContainer.current.scrollTop = newScrollTop;

    console.log(
      "resized",
      scroll,
      scrollContainerHeight,
      scrollContainer.current.scrollHeight
    );

    if (newScrollTop) {
      setScroll(newScrollTop);
      setScrollContainerHeight(scrollContainer.current.scrollHeight);
      console.log(
        "new scroll top",
        scroll,
        scrollContainerHeight,
        scrollContainer.current.scrollHeight
      );
    }
  }, [scroll, scrollContainerHeight]);

  useEffect(() => {
    console.log("one of them changed");
    window.addEventListener("resize", resizeHandler, true);
    return () => {
      window.removeEventListener("resize", resizeHandler, true);
    };
  }, [scroll, scrollContainerHeight]);

  useLayoutEffect(() => {
    console.log("use layout effect");
    setScrollContainerHeight(scrollContainer.current.scrollHeight);
    if (!firstUpdate.current && videos.scrollChange < 0) {
      console.log("scroll top", scrollContainer.current.scrollTop);
      scrollContainer.current.scrollTop = scroll + videos.scrollChange;

      console.log(
        "uselayouteffect",
        videos.scrollChange,
        scrollContainer.current.scrollTop
      );
    } else if (!firstUpdate.current && videos.scrollChange > 0) {
      let height = 0;
      for (let i = 0; i < videos.scrollChange; i++) {
        console.log("height loop use layout effect");
        let childHeight =
          scrollContainer.current.children[i].getBoundingClientRect().height;
        height = height + childHeight;
      }
      scrollContainer.current.scrollTop = scroll + height;
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
    if (true) {
      console.log("videos length", newVideos.length);

      for (let i = 0; i < newVideos.length - 25; i++) {
        console.log("height loop");
        let childHeight =
          scrollContainer.current.children[i].getBoundingClientRect().height;
        console.log(scrollContainer.current.children[i], childHeight);
        height = height + childHeight;
      }
      let dummy = 0;
      for (let i = 0; i < scrollContainer.current.children.length; i++) {
        let childHeight =
          scrollContainer.current.children[i].getBoundingClientRect().height;
        console.log(childHeight);
        console.log(
          "margin",
          window.getComputedStyle(scrollContainer.current.children[i]).margin
        );
        dummy = dummy + childHeight;
      }
      console.log(
        "dummy",
        dummy,
        "scroll container",
        scrollContainer.current.scrollHeight
      );
      let videosToRemoveFromTop = newVideos.splice(0, newVideos.length - 25);
      // setScroll(scrollContainer.current.scrollTop);
      // scrollContainer.current.addEventListener("scroll", changeScroll, true);

      prevVids.push(...videosToRemoveFromTop);
    }
    if (height > 0) {
      height = -Math.abs(height);
    }
    console.log("getvideos", height, scrollContainer.current.scrollTop);

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

      // setScroll(scrollContainer.current.scrollTop);
      // scrollContainer.current.addEventListener("scroll", changeScroll, true);
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
      <div className="absolute">
        <div className="absolute-child" onClick={() => getPreviousVideos(3)}>
          P
        </div>
        <div className="absolute-child" onClick={() => getVideos(3)}>
          L
        </div>
        <div
          className="absolute-child"
          onClick={() => console.log(scrollContainerHeight, scroll)}
        >
          =
        </div>
      </div>
      <div
        className="slider-container"
        ref={scrollContainer}
        onScroll={updateScroll}
      >
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

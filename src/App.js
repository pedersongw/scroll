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
  const [videos, setVideos] = useState({ videos: [], scrollChange: 0 });
  const [laterVideos, setLaterVideos] = useState([]);

  const [scrollContainerHeight, setScrollContainerHeight] = useState();
  const [scroll, setScroll] = useState();
  const observerRef = useRef();

  const firstUpdate = useRef(true);
  const scrollContainer = useRef(null);

  useEffect(() => {
    if (firstUpdate.current) {
      scrollContainer.current.scrollTop = 0;
      setScroll({ scroll: 0, direction: 1 });
      setScrollContainerHeight(scrollContainer.current.scrollHeight);
      firstUpdate.current = false;
    }
    getVideos(25);
  }, []);

  const updateScroll = useCallback((event) => {
    setScroll((prevScroll) => {
      let newScroll = {
        scroll: event.target.scrollTop,
        direction: event.target.scrollTop - prevScroll.scroll > 0 ? 1 : -1,
      };

      return newScroll;
    });
  }, []);

  const resizeHandler = useCallback(() => {
    let newScrollTop =
      (scroll.scroll / scrollContainerHeight) *
      scrollContainer.current.scrollHeight;
    scrollContainer.current.scrollTop = newScrollTop;

    if (newScrollTop) {
      setScroll({ scroll: newScrollTop, direction: scroll.direction });
      setScrollContainerHeight(scrollContainer.current.scrollHeight);
    }
  }, [scroll, scrollContainerHeight]);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler, true);
    return () => {
      window.removeEventListener("resize", resizeHandler, true);
    };
  }, [scroll, scrollContainerHeight]);

  const myFunc = useCallback(
    (e, direction) => {
      if (direction === "later") {
        console.log(e);
        observerRef.current.unobserve(e.target);
        getVideos(10);
      } else if (direction === "earlier") {
        if (previousVideos.length === 0) {
          observerRef.current.unobserve(e.target);
          console.log("unobserving");
        } else {
          getPreviousVideos(10);
          console.log(e, previousVideos);
        }
      }
    },
    [previousVideos, videos]
  );

  useLayoutEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((e) => {
          if (
            e.isIntersecting &&
            Number(e.target.id) === 21 &&
            e.boundingClientRect.top > 0
          ) {
            myFunc(e, "later");
          } else if (
            e.isIntersecting &&
            Number(e.target.id) === 3 &&
            e.boundingClientRect.top < 0
          ) {
            myFunc(e, "earlier");
          }
        });
      },
      {
        threshold: 0.01,
      }
    );

    if (observerRef.current && scrollContainer.current.children.length > 0) {
      observerRef.current.disconnect();

      observerRef.current.observe(scrollContainer.current.children[3]);
      observerRef.current.observe(scrollContainer.current.children[21]);
    }
    console.log(videos);
    setScrollContainerHeight(scrollContainer.current.scrollHeight);

    if (!firstUpdate.current && videos.scrollChange < 0) {
      scrollContainer.current.scrollTop = scroll.scroll + videos.scrollChange;
    } else if (!firstUpdate.current && videos.scrollChange > 0) {
      let height = 0;
      for (let i = 0; i < videos.scrollChange; i++) {
        let childHeight =
          scrollContainer.current.children[i].getBoundingClientRect().height;
        height = height + childHeight;
      }
      scrollContainer.current.scrollTop = scroll.scroll + height;
    }
    return () => {
      observerRef.current.disconnect();
    };
  }, [videos]);

  const getVideos = (length) => {
    console.log("get videos called");
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
      for (let i = 0; i < newVideos.length - 25; i++) {
        let childHeight =
          scrollContainer.current.children[i].getBoundingClientRect().height;

        height = height + childHeight;
      }
      let videosToRemoveFromTop = newVideos.splice(0, newVideos.length - 25);

      prevVids.push(...videosToRemoveFromTop);
    }
    if (height > 0) {
      height = -Math.abs(height);
    }

    setVideos({
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
    setVideos({
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
        <div className="absolute-child" onClick={() => getVideos(10)}>
          L
        </div>

        <div
          className="absolute-child"
          onClick={() => console.log(observerRef.current.takeRecords())}
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
              <VideoCard key={index} index={video} id={index} />
            ))}
          </>
        ) : null}
      </div>
    </main>
  );
}

export default App;

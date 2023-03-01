const VideoCard = ({ index }) => {
  return (
    <div className="slider-children">
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          height: "100%",
        }}
      >
        <h1>Video {index}</h1>
      </div>
    </div>
  );
};

export default VideoCard;

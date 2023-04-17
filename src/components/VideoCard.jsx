const VideoCard = ({ index, id }) => {
  return (
    <div className="slider-children" id={id}>
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

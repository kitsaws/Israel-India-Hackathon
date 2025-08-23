function YouTubeEmbed() {
  return (
    <div className="w-full h-[80%] flex justify-center items-center p-16">
      <iframe
        src="https://www.youtube.com/embed/videoseries?list=PL7v1FHGMOadDghZ1m-jEIUnVUsGMT9jbH"
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-[60%] h-full"
      ></iframe>
    </div>
  );
}

export default YouTubeEmbed;

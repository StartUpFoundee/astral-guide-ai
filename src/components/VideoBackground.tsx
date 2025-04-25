
import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute h-full w-full object-cover"
        style={{ minHeight: '100vh', minWidth: '100vw' }}
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default VideoBackground;

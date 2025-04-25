
import React from 'react';

const StarBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="stars-container absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star absolute rounded-full bg-white/80"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StarBackground;

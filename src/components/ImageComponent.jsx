import React, { useState } from 'react';
import { ShimmerThumbnail } from 'react-shimmer-effects';

function ImageComponent({ src, alt, shimmerHeight, shimmerWidth, width, height, className, rounded }) {
  const [loaded, setLoaded] = useState(true);

  return (
    <div className={`position-relative ${width ? '' : 'w-100 h-100'}`}>
      {loaded && (
        <ShimmerThumbnail height={shimmerHeight} width={shimmerWidth} rounded={rounded} className="mb-0 dark-shimmer" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoaded(false)}
        className={`img-fluid ${rounded} object-fit-cover ${width ? '' : 'w-100 h-100'} ${loaded ? 'd-none' : 'd-block'} ${className}`}
      />
    </div>
  );
}

export default ImageComponent;

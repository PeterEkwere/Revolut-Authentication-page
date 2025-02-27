const BinanceLoader = () => {
  return (
    // Container - adjust h-4 to change overall height of the container
    <div className="flex items-center justify-center gap-0.5 h-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          // Bar styling
          // - w-0.5: width of each bar (can use w-1, w-1.5, w-2 etc. for thicker bars)
          // - h-2: height of bars (can use h-3, h-4 etc. for taller bars)
          // - bg-yellow-400: color of bars (try bg-yellow-300 for lighter or bg-yellow-500 for darker)
          // - rounded-full: fully rounded edges (use rounded for less rounded)
          className="w-0.5 h-3 bg-[black] animate-pulse"
          style={{
            // Animation configuration
            // - 1.4s: total duration of animation (adjust for faster/slower animation)
            // - ease-in-out: timing function (try linear, ease-in, ease-out)
            // - index * 0.16s: delay between bars (lower number = smaller delay)
            // - infinite: makes animation loop forever
            animation: `barLoader 1.4s ease-in-out ${index * 0.16}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes barLoader {
          // Animation keyframes
          // - Adjust scale values to change how much bars stretch
          // - 0.4 = 40% of original size
          // - 1 = 100% of original size
          0% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
          40% {
            transform: scaleY(0.4);
          }
          100% {
            transform: scaleY(0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default BinanceLoader;

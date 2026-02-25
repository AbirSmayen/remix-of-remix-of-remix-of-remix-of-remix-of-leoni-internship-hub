const GoldStars = ({ count = 5, size = "md" }: { count?: number; size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          className={sizes[size]}
          viewBox="0 0 24 24"
          fill="none"
        >
          <defs>
            <linearGradient id={`gold-star-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F6D365" />
              <stop offset="30%" stopColor="#D4A843" />
              <stop offset="60%" stopColor="#C49A2E" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#gold-star-${i})`}
            stroke="#B8860B"
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
};

export default GoldStars;

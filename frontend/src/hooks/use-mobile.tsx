import { useEffect, useState } from 'react';

export function useIsMobile(min: number = 1024, max: number = 1440): boolean {
  // Start with false to avoid SSR/Initial load mismatches
  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    // Check only once the component has actually mounted in the browser
    const checkIsLaptop = () => {
      setIsLaptop(window.innerWidth >= min && window.innerWidth <= max);
    };

    checkIsLaptop(); // Initial check

    window.addEventListener('resize', checkIsLaptop);
    return () => window.removeEventListener('resize', checkIsLaptop);
  }, [min, max]);

  return isLaptop;
}
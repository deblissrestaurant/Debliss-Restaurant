import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({
  from,
  to,
  duration = 1,
  suffix = "",
  prefix = "",
  infinite = false,
}: {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  infinite?: boolean;
}) => {
  const count = useMotionValue(from);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [isInfinite, setIsInfinite] = useState(false);

  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration,
        ease: "easeInOut",
        onComplete: () => infinite && setIsInfinite(true),
      });

      return controls.stop;
    }
  }, [count, to, duration, isInView, infinite]);

  return (
    <div>
      <motion.span ref={ref}>
        {prefix}
        <motion.span>{isInfinite ? "∞" : rounded}</motion.span>
        {suffix}
      </motion.span>
    </div>
  );
};

export default AnimatedCounter;

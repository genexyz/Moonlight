import Image from "next/image";

// Motion
import { motion } from "framer-motion";

// Styles
import styles from "./Background.module.css";

const Background = () => {
  return (
    <section id="background">
      <motion.div
        className={styles.background}
        transition={{
          scale: {
            repeat: Infinity,
            duration: 8,
            delay: 1,
          },
        }}
        animate={{ scale: [1, 1.03, 1] }}
      >
        <Image
          src={`/images/backgrounds/Background.webp`}
          alt={`Background Main Image`}
          layout="fill"
          objectFit="cover"
          quality={75}
        />
      </motion.div>
      <motion.div
        className={styles.background}
        transition={{
          scale: {
            repeat: Infinity,
            duration: 25,
            delay: 1,
          },
        }}
        animate={{ scale: [1, 1.2, 1] }}
      >
        <Image
          src={`/images/backgrounds/Asteroids.webp`}
          alt={`Background Asteroids Image`}
          layout="fill"
          objectFit="cover"
          quality={75}
        />
      </motion.div>
      <motion.div
        className={styles.background}
        transition={{
          scale: {
            repeat: Infinity,
            duration: 4,
            delay: 1,
          },
        }}
        animate={{ scale: [1, 1.02, 1] }}
      >
        <Image
          src={`/images/backgrounds/SecondLayer.webp`}
          alt={`Background Second Rocks Layer Image`}
          layout="fill"
          objectFit="cover"
          quality={75}
        />
      </motion.div>
      <div className={styles.background}>
        <Image
          src={`/images/backgrounds/FirstLayer.webp`}
          alt={`Background First Rocks Layer Image`}
          layout="fill"
          objectFit="cover"
          quality={75}
        />
      </div>
    </section>
  );
};

export default Background;

// Next
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

// Motion
import { motion } from "framer-motion";

// Styles
import styles from "./Mainpage.module.css";

// Hooks
import { useScrollPosition } from "./hooks/useScrollPosition";

export default function Mainpage() {
  const { data: session } = useSession();
  const scrollPosition = useScrollPosition();
  return (
    <div className={styles.background}>
      <section
        className={styles.main__section}
        style={scrollPosition > 0 ? { top: scrollPosition * 0.5 + "px" } : {}}
      >
        <motion.div
          className={styles.divImg}
          style={scrollPosition > 0 ? { left: scrollPosition * 0.75 + "px" } : {}}
          initial={{ x: 300, scale: 1 }}
          transition={{
            duration: 3,
            scale: {
              repeat: Infinity,
              duration: 8,
              delay: 1,
            },
          }}
          animate={{ x: 0, scale: [1, 1.05, 1] }}
        >
          <Image
            src={"/images/backgrounds/Stars.webp"}
            alt="Background Image - Stars"
            layout="fill"
            objectFit="cover"
            quality={75}
          />
        </motion.div>
        <motion.div
          className={styles.divImg}
          id={styles["moon"]}
          style={scrollPosition > 0 ? { top: scrollPosition * 0.8 + "px" } : {}}
          initial={{ x: 500 }}
          transition={{
            duration: 3,
            scale: {
              repeat: Infinity,
              duration: 5,
              delay: 3,
            },
          }}
          animate={{ x: 0, scale: [1, 1.1, 1] }}
        >
          <Image
            src={"/images/backgrounds/Moon.webp"}
            alt="Background Image - Moon"
            layout="fill"
            objectFit="cover"
            quality={75}
          />
        </motion.div>
        <motion.div
          className={styles.divImg}
          style={scrollPosition > 0 ? { top: scrollPosition * 0.8 + "px" } : {}}
          initial={{ y: 600 }}
          transition={{ duration: 1.5 }}
          animate={{ y: 0 }}
        >
          <Image
            src={"/images/backgrounds/MountainsBehind.webp"}
            alt="Background Image - Mountains Behind"
            layout="fill"
            objectFit="cover"
            quality={75}
          />
        </motion.div>
        <Link href={!session ? "/api/auth/signin" : "/launch"} passHref>
          <motion.a
            id={styles["btn"]}
            style={scrollPosition > 0 ? { marginTop: scrollPosition * 1.8 + "px" } : {}}
            initial={{ y: 500 }}
            transition={{ duration: 5, type: "spring", stiffness: 15 }}
            animate={{ y: 0, duration: 2.5 }}
            whileHover={{ scale: 1.2 }}
          >
            {!session ? "Log in to Launch" : "Launch! 🚀"}
          </motion.a>
        </Link>
        <motion.div
          className={styles.divImg}
          style={scrollPosition > 0 ? { top: scrollPosition * 0.4 + "px" } : {}}
          initial={{ y: 500 }}
          transition={{ duration: 1.8 }}
          animate={{ y: 0 }}
        >
          <Image
            src={"/images/backgrounds/MountainsFront.webp"}
            alt="Background Image - Mountains Front"
            layout="fill"
            objectFit="cover"
            quality={75}
          />
        </motion.div>
      </section>
      <section id="description" className={styles.desc}>
        <h2>Our Mission</h2>
        <motion.h3 whileHover={{ scale: 1.05 }}>📓 Who are we?</motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [-300, 0] }}
          viewport={{ once: true }}
        >
          Moonlight{"'"}s mission is to provide safe and reliable transportation of cargo
          across the Milky Way galaxy. The company strives to be the leading provider of
          space transportation services, and to provide its customers with the highest
          level of safety, security, and satisfaction. The company is committed to
          providing a safe and efficient transportation system that meets the needs of its
          customers and the Milky Way galaxy community.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [-300, 0] }}
          viewport={{ once: true }}
        >
          Moonlight has a fleet of ships that are equipped with the latest technology to
          make sure your goods arrive safe and sound. Our highly trained astronauts and
          engineers ensure the safety of the cargo and make us proud of their work. We
          pride ourselves on our customer service and our ability to get your goods to you
          in a timely manner.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [-300, 0] }}
          viewport={{ once: true }}
        >
          We are a technology company that bridges the physical and digital worlds so
          everyone can send cargo anywhere at the touch of a button. We are a team of
          passionate people who are building the future of space transportation.
        </motion.p>

        <motion.h3 initial={{ textAlign: "right" }} whileHover={{ scale: 1.05 }}>
          🌄 Sustainability
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [300, 0] }}
          viewport={{ once: true }}
        >
          Moonlight is committed to becoming an zero emission platform by 2080, with 100%
          of trips in low/zero-emission vehicles. Being the most important mobility
          platform in the Milky Way galaxy, our commitment is to face the challenge of
          climate change in the inner planets with more force. We will achieve this by
          investing in the development of new technologies and by working with our
          partners to accelerate the transition to a zero-emission future for the sMilky
          Way galaxy.
        </motion.p>

        <motion.h3 whileHover={{ scale: 1.05 }}>
          🌠 Cargo, Tourism and much more
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [-300, 0] }}
          viewport={{ once: true }}
        >
          In addition to helping cargo find a way to get around, we also offer a variety
          of travel options for those who want to see the Milky Way galaxy. Space tourism
          is a growing industry, and we are proud to be a part of it. Our goal is to make
          space travel affordable and accessible to everyone. We are working hard to
          achieve this goal, and we are excited to see what the future holds.
        </motion.p>

        <motion.h3 initial={{ textAlign: "right" }} whileHover={{ scale: 1.05 }}>
          🔒 Safety & Security
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [300, 0] }}
          viewport={{ once: true }}
        >
          Your security is important to us, whether you are a company or personal user of
          the App. We are committed to doing our part, and technology is the key to that
          strategy. We partner with security advocates and develop new technologies and
          systems to provide a safer and easier mobility experience for everyone. Space is
          a dangerous place, and we are committed to making it safer for all.
        </motion.p>
      </section>
    </div>
  );
}

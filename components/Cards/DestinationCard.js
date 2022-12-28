import styles from "./DestinationCard.module.css";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const DestinationCard = (props) => {
  const [currentVariant, setCurrentVariant] = useState("visible");

  const handleVariantChange = () => {
    if (currentVariant === "visible") {
      setCurrentVariant("hidden");
    } else {
      setCurrentVariant("visible");
    }
  };
  const title = {
    hidden: { y: 30, transition: { duration: 0.2 } },
    visible: { y: 150 },
  };

  const items = {
    hidden: { opacity: 1, transition: { duration: 0.2 } },
    visible: { opacity: 0 },
  };

  const image = {
    hidden: { filter: "brightness(40%)" },
    visible: { filter: "brightness(100%)" },
  };

  return (
    <motion.div
      className={styles.destinationcard}
      initial="visible"
      animate={currentVariant}
      onClick={handleVariantChange}
      whileHover="hidden"
    >
      <motion.div className={styles.imgDiv} variants={image}>
        <Image
          src={props.data.image}
          alt={`Destination ${props.data.name} Image`}
          layout="fill"
          quality={80}
        />
      </motion.div>

      <motion.h4 variants={title}>{props.data.name}</motion.h4>

      <motion.p variants={items}>{props.data.description}</motion.p>
      <Link href={`/destinations/${props.data.id}`} passHref>
        <motion.a className={styles.btn_primary} variants={items}>
          🚀 EXPLORE 🚀
        </motion.a>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;

import styles from "./PlanetCard.module.css";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const PlanetCard = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const cardBackColor =
    "linear-gradient(45deg, " +
    props.data.color1 +
    " , " +
    props.data.color2 +
    ", #ffffff 78% )";
  const btnBackColor =
    "linear-gradient(90deg, " + props.data.color2 + ", " + props.data.color1 + ")";
  const boxColor =
    "0 0 3px " +
    props.data.color1 +
    ",0 0 7px " +
    props.data.color1 +
    ",0 0 11px " +
    props.data.color2 +
    ",0 0 15px " +
    props.data.color2 +
    "";

  const isDestinationValid = !!props.data;

  return (
    <div className={`${styles.forTest} ${isOpen ? styles.openMargin : null} `}>
      <motion.div
        transition={{ layout: { duration: 0.7 } }}
        layout
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.card} ${!isOpen ? styles.openCard : null} `}
        style={{
          borderRadius: "2rem",
          background: cardBackColor,
        }}
        whileHover={!isOpen && { scale: 1.1, boxShadow: boxColor }}
      >
        <motion.h2 transition={{ layout: { duration: 0.7 } }} layout="position">
          {props.data.name}
        </motion.h2>

        <motion.div
          layout="position"
          animate={(isOpen && { scale: 1.5 }) || (!isOpen && { scale: 1 })}
          whileHover={(isOpen && { scale: 1.7 }) || (!isOpen && { scale: 1.2 })}
          transition={{ layout: { duration: 0.7 } }}
          className={`${styles.imgDiv}`}
        >
          <Image
            src={props.data.image}
            alt={`Planet ${props.data.name} Image`}
            layout="fill"
            quality={70}
          />
        </motion.div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className={styles.expand}
          >
            {isDestinationValid && (
              <div>
                <p>
                  <span className={styles.cardStrongP}>Gravity:</span>{" "}
                  {props.data.gravity} m/s²
                </p>
                <p>
                  <span className={styles.cardStrongP}>Type:</span> {props.data.type}
                </p>
                <p>
                  <span className={styles.cardStrongP}>Cords:</span> {props.data.coords}
                </p>
                <p>
                  <span className={styles.cardStrongP}>Description:</span>{" "}
                  {props.data.description}
                </p>
                <br></br>
              </div>
            )}
            <Link href={`/planets/${props.data.id}`}>
              <a>
                <motion.button
                  className={styles.btn_primary}
                  style={
                    isDestinationValid
                      ? {
                          background: btnBackColor,
                        }
                      : {
                          background: "linear-gradient(90deg, #000000 , #ff0000)",
                          cursor: "auto",
                        }
                  }
                  whileHover={
                    isDestinationValid && {
                      scale: 1.1,
                      boxShadow: "1px 5px 2rem rgba(0, 0, 0, 0.8)",
                    }
                  }
                >
                  {isDestinationValid ? "🚀 Explore 🚀" : "Travel not available"}
                </motion.button>
              </a>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PlanetCard;

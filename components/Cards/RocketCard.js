import styles from "./RocketCard.module.css";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const RocketCard = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const color1 = "#00e1ff";
  const color2 = "#c300ff";
  const cardBackColor =
    "linear-gradient(45deg, " + color1 + " , " + color2 + ", #ffffff 78% )";
  const btnBackColor = "linear-gradient(90deg, " + color2 + ", " + color1 + ")";
  const boxColor =
    "0 0 3px " +
    color1 +
    ",0 0 7px " +
    color1 +
    ",0 0 11px " +
    color2 +
    ",0 0 15px " +
    color2 +
    "";

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
            alt={`Rocket ${props.data.name} Image`}
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
            {
              <div>
                <p>
                  <span className={styles.cardStrongP}>Base Cost:</span>{" "}
                  {props.data.baseCost}
                </p>
                <p>
                  <span className={styles.cardStrongP}>Dist Cost:</span>{" "}
                  {props.data.distCost}
                </p>
                <p>
                  <span className={styles.cardStrongP}>Autonomy:</span>{" "}
                  {props.data.autonomy}
                </p>
                <p>
                  <span className={styles.cardStrongP}>Power:</span> {props.data.power}
                </p>
                <p>
                  <span className={styles.cardStrongP}>Max Speed:</span>{" "}
                  {props.data.maxSpeed}
                </p>
                <br></br>
              </div>
            }
            <Link href={`/rockets/${props.data.id}`}>
              <a>
                <motion.button
                  className={styles.btn_primary}
                  style={{ background: btnBackColor }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "1px 5px 2rem rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {"🚀 See details 🚀"}
                </motion.button>
              </a>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RocketCard;

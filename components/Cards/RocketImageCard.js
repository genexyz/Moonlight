import classes from "./RocketImageCard.module.css";
import Image from "next/image";

const RocketImageCard = (props) => {
  return (
    <div className={classes.rocketImageCard}>
      <Image src={props.image} alt={props.title} width={420} height={300} />
      <h4>{props.title}</h4>
    </div>
  );
};

export default RocketImageCard;

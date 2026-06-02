import { ElementType, ChangeEvent } from "react";
import styles from "./Input.module.css"

type InputProps = {
  icon?: ElementType;
  size?: number;
  required?: boolean;
  type: string;
  placeholder: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input(props: InputProps) {
  const IconComponent = props.icon;
  return (
    <div className={styles['input-container']}>
      {IconComponent && (
        <span className={styles['input-icon']}>
          <IconComponent size={props.size} />
        </span>
      )}
      <input
        onChange={props.onChange}
        name={props.name}
        required={props.required}
        type={props.type}
        placeholder={props.placeholder}
      />
    </div>
  );
}

import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';
import * as styles from './Button.css';
import { textStyle } from '@/styles/text.css';

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
}

const textStyleBySize = {
  small: textStyle.body1R,
  medium: textStyle.body1SB,
  large: textStyle.headline2B,
};

const Button = ({
  variant,
  size,
  className,
  children,
  ...buttonProps
}: ButtonProps) => (
  <button
    {...buttonProps}
    className={`${styles.buttonBase} ${styles.buttonStyleByVariant[variant]} ${styles.buttonStyleBySize[size]} ${textStyleBySize[size]} ${className}`}
  >
    {children}
  </button>
);

export default Button;

import { type ReactNode } from 'react';
import * as styles from './FormItem.css';
import FormInput, {
  type FormImageInputProps,
  type FormTextInputProps,
} from '@/components/common/FormInput';
import { textStyle } from '@/styles/text.css';
import { className } from '@/utils/style';

interface FormItemPropsBase {
  label: string;
  optional?: boolean;
  caption?: string;
  errorMessage?: string;
}

interface FormTextItemProps
  extends FormItemPropsBase,
    Omit<FormTextInputProps, 'isError'> {}

interface FormImageItemProps
  extends FormItemPropsBase,
    Omit<FormImageInputProps, 'isError'> {}

const FormItemLayout = ({
  label,
  optional,
  caption,
  errorMessage,
  children,
}: FormItemPropsBase & { children: ReactNode }) => (
  <div className={styles.container}>
    <div className={styles.titleArea}>
      <span className={textStyle.subtitle2SB}>{label}</span>
      {optional && <span className={styles.optionalText}>(선택)</span>}
    </div>
    {children}
    <span
      className={className(
        styles.caption,
        errorMessage ? styles.errorText : undefined,
      )}
    >
      {errorMessage ? errorMessage : caption}
    </span>
  </div>
);

const FormTextItem = ({
  label,
  optional,
  caption,
  errorMessage,
  ...inputProps
}: FormTextItemProps) => (
  <FormItemLayout
    label={label}
    optional={optional}
    caption={caption}
    errorMessage={errorMessage}
  >
    <FormInput.Text {...inputProps} isError={!!errorMessage} />
  </FormItemLayout>
);

const FormImageItem = ({
  label,
  optional,
  caption,
  errorMessage,
  ...inputProps
}: FormImageItemProps) => (
  <FormItemLayout
    label={label}
    optional={optional}
    caption={caption}
    errorMessage={errorMessage}
  >
    <FormInput.Image {...inputProps} isError={!!errorMessage} />
  </FormItemLayout>
);

const FormItem = {
  Text: FormTextItem,
  Image: FormImageItem,
};

export default FormItem;

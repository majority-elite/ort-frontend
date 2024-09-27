import {
  useRef,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react';
import * as styles from './FormInput.css';
import { getDataURLFromFiles } from '@/utils/form';
import { className } from '@/utils/style';

interface FormInputPropsBase
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  isError?: boolean;
}

export interface FormTextInputProps extends FormInputPropsBase {
  Icon?: (props: { className?: string }) => JSX.Element;
  onTextChange?: (newText: string) => void;
}

const FormTextInput = ({
  Icon,
  isError,
  onTextChange,
  ...inputProps
}: FormTextInputProps) => (
  <div
    className={className(
      styles.textInputContainer,
      isError ? styles.error : undefined,
      !inputProps.value ? styles.blank : undefined,
    )}
  >
    {Icon && <Icon className={styles.textInputIcon} />}
    <input
      type="text"
      {...inputProps}
      className={className(styles.textInput, inputProps.className)}
      onChange={(e) => {
        inputProps.onChange?.(e);
        onTextChange?.(e.currentTarget.value);
      }}
    />
  </div>
);

export interface FormImageInputProps extends FormInputPropsBase {
  multiple?: false;
  previewImageUrl?: string;
  onImageChange?: (imageUrl: string) => void;
}

const FormImageInput = ({
  isError,
  multiple = false,
  previewImageUrl,
  onImageChange,
  ...inputProps
}: FormImageInputProps) => {
  const inputElement = useRef<HTMLInputElement>(null);

  return (
    <button
      className={className(
        styles.imageInputContainer,
        isError ? styles.error : undefined,
      )}
      onClick={() => {
        inputElement.current?.click();
      }}
    >
      {previewImageUrl?.length === 0 && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.3829 9.12812C12.3829 7.75351 13.4973 6.63917 14.8719 6.63917C16.2465 6.63917 17.3608 7.75351 17.3608 9.12812C17.3608 10.5027 16.2465 11.6171 14.8719 11.6171C13.4973 11.6171 12.3829 10.5027 12.3829 9.12812ZM14.8719 7.78792C14.1317 7.78792 13.5317 8.38794 13.5317 9.12812C13.5317 9.86829 14.1317 10.4683 14.8719 10.4683C15.612 10.4683 16.2121 9.86829 16.2121 9.12812C16.2121 8.38794 15.612 7.78792 14.8719 7.78792ZM20.2595 16.1904C20.4241 15.7995 20.5574 15.3918 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437C13.0166 2.88543 10.9834 2.88543 9.02975 3.3437C6.20842 4.00549 4.0055 6.20841 3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C3.39229 15.1774 3.44919 15.3812 3.51403 15.5813L4.11782 14.9777C6.30157 12.7943 9.84209 12.7943 12.0258 14.9777L13.7165 16.668L14.1597 16.2249C15.8579 14.5271 18.5837 14.547 20.2595 16.1904ZM19.701 17.2801L19.6765 17.2506C18.4761 15.8104 16.2978 15.7116 14.9719 17.0373L14.5289 17.4802L16.9422 19.8931C18.0581 19.2711 18.9993 18.3786 19.6794 17.302C19.6868 17.2948 19.694 17.2875 19.701 17.2801ZM15.8264 20.4019L11.2136 15.79C9.47848 14.0552 6.66518 14.0552 4.93003 15.79L3.99195 16.7279C5.00173 18.6839 6.82731 20.1397 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C15.2626 20.5877 15.5484 20.5026 15.8264 20.4019Z"
            fill="#9E9E9E"
          />
        </svg>
      )}
      <input
        ref={inputElement}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        {...inputProps}
        className={className(
          styles.imageInput,

          inputProps.className,
        )}
        multiple={multiple}
        onChange={async (e) => {
          inputProps.onChange?.(e);

          e.preventDefault();
          const files = e.target.files;

          if (files && files[0]) {
            const urls = await getDataURLFromFiles(files[0]);
            onImageChange?.(urls[0]);
          }

          e.currentTarget.value = '';
        }}
      />
      {previewImageUrl && previewImageUrl.length > 0 && (
        <img
          src={previewImageUrl}
          alt="preview before upload"
          className={styles.imageInputPreview}
        />
      )}
    </button>
  );
};

const FormInput = {
  Text: FormTextInput,
  Image: FormImageInput,
};

export default FormInput;

import { forwardRef } from "react";

type Props = {
  label: string;
  name: string;
  type?: "text" | "number";
  placeholder: string;
} & React.HTMLProps<HTMLInputElement>;

type Ref = HTMLInputElement;

// eslint-disable-next-line react/display-name
const FormInput = forwardRef<Ref, Props>(
  ({ label, type, name, placeholder, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1 text-white">
        <label className="text-lg font-medium">{label}</label>
        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          className="rounded-lg bg-black-100 py-3 px-4 font-inter placeholder:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple"
          {...rest}
        />
      </div>
    );
  }
);

export { FormInput };

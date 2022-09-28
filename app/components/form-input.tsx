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
      <div className="flex flex-col gap-1 text-slate-900 focus-within:outline-slate-500">
        <label className="text-lg font-medium">{label}</label>
        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          className="rounded-lg bg-white py-3 px-4 font-inter placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"
          {...rest}
        />
      </div>
    );
  }
);

export { FormInput };

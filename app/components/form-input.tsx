const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  ...rest
}: {
  label: string;
  name: string;
  type?: "text" | "number";
  placeholder: string;
} & React.HTMLProps<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2 text-slate-900 focus-within:outline-slate-500">
      <label className="text-lg font-medium">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="rounded-lg bg-white p-4 font-inter placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"
        {...rest}
      />
    </div>
  );
};

export { FormInput };

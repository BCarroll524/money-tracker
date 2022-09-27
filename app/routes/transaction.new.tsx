import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import * as Select from "@radix-ui/react-select";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import clsx from "clsx";
import React, { useState } from "react";
import type { TrakrHandle } from "types";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/header";
import { CheckIcon } from "@heroicons/react/24/solid";
import { requireUser } from "~/utils/session.server";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUsersSources } from "~/models/user.server";
import { createTransaction } from "~/models/transaction.server";
import { getErrorMessage } from "~/utils";

export const handle: TrakrHandle & { id: string } = {
  id: "new-transaction",
  backgroundColor: "bg-slate-200",
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const sources = await getUsersSources(user.id);

  return json({ sources });
};

export const action = async ({ request }: ActionArgs) => {
  const form = new URLSearchParams(await request.text());
  console.log(form);
  const name = form.get("name");
  const amount = form.get("amount");
  const sourceId = form.get("sourceId");
  const type = form.get("type");
  const category = form.get("category");

  if (!name || !amount || !sourceId || !type || !category) {
    return json({ error: "Please fill out all form fields" }, { status: 400 });
  }

  const user = await requireUser(request);

  try {
    const transaction = await createTransaction({
      name,
      amount: Number(amount) * 100,
      sourceId,
      type,
      label: category,
      userId: user.id,
    });

    return redirect("/?tId=" + transaction.id);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    return json({ error: message }, { status: 400 });
  }
};

export default function NewTransaction() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <section className="min-h-full px-5 pt-20 pb-8">
      <Header />
      <h1 className="pb-4 text-2xl font-medium text-slate-900">
        New Transaction Details
      </h1>
      {actionData?.error ? (
        <p className="pb-2 text-base text-red-500">{actionData.error}</p>
      ) : null}
      <Form method="post" className="min-f-full flex flex-col gap-4">
        <FormInput label="Name" name="name" placeholder="Gym membership" />
        <FormInput
          label="Amount Spent"
          name="amount"
          placeholder="10.00"
          type="number"
          min={0}
          step=".01"
        />
        <FormSelect
          options={data.sources.map((source) => ({
            value: source.id,
            label: source.name,
          }))}
          label="Card Used"
          name="sourceId"
        />
        <FormRadioGroup
          options={[
            { label: "splurge", value: "splurge" },
            { label: "nice to have", value: "nice-to-have" },
            { label: "need", value: "need" },
          ]}
          label="Was this a"
          name="type"
        />
        <FormCategories
          options={[
            {
              color: "bg-red-300",
              value: "⛽️",
            },
            {
              color: "bg-yellow-200",
              value: "🚕",
            },
            {
              color: "bg-lime-100",
              value: "🍔",
            },
            {
              color: "bg-yellow-100",
              value: "☕️",
            },
            {
              color: "bg-blue-200",
              value: "👕",
            },
            {
              color: "bg-neutral-300",
              value: "🏋🏻",
            },
            {
              color: "bg-violet-900",
              value: "🧾",
            },
          ]}
          label="Category"
          name="category"
        />
        <button className="mt-8 flex w-full flex-1 items-center justify-between rounded-lg bg-slate-700 py-2 px-3 text-white">
          <span className="text-base font-semibold uppercase">create</span>
          <CheckIcon className="h-5 w-5 text-white" />
        </button>
      </Form>
    </section>
  );
}

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

const FormTextarea = ({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) => {
  return (
    <div className="flex flex-col gap-2 text-slate-900">
      <label className="text-lg font-medium">{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        className="rounded-lg bg-white p-4 font-inter placeholder:text-gray-500"
      />
    </div>
  );
};

const FormSelect = ({
  label,
  name,
  options,
  className,
}: {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  className?: string;
}) => {
  const [selected, onSelect] = useState(options[0]);
  return (
    <div className="flex flex-col gap-2 text-slate-900">
      <label className="text-lg font-medium">{label}</label>
      <Select.Root
        name={name}
        value={selected.value}
        onValueChange={(v) => {
          const option = options.find((o) => o.value === v);

          if (option) {
            onSelect(option);
          }
        }}
      >
        <Select.Trigger
          className={clsx(
            "flex items-center justify-between rounded-lg border-2 bg-white p-4 focus:!outline-none",
            className
          )}
        >
          <Select.Value asChild className="flex items-center">
            <p className="text-lg font-medium text-slate-900">
              {selected.label}
            </p>
          </Select.Value>
          <Select.Icon asChild>
            <ChevronDownIcon className="h-4 w-4 stroke-2 text-slate-900" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="z-[9999] min-w-fit rounded-xl bg-gray-900 p-1 shadow-md">
            <Select.ScrollUpButton className="ml-auto mr-auto p-1">
              <ChevronUpIcon className="h-4 w-4 stroke-2 text-white" />
            </Select.ScrollUpButton>
            <Select.Viewport>
              {options.map((option, index) => (
                <SelectItem
                  key={index}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="ml-auto mr-auto p-1">
              <ChevronDownIcon className="h-4 w-4 stroke-2 text-white" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

const SelectItem = ({ label, value }: { label: string; value: string }) => (
  <Select.Item
    value={value}
    className="group flex w-full items-center justify-center gap-6 rounded-lg py-2 outline-none hover:bg-gray-700 focus-visible:!outline-none"
  >
    <Select.ItemText>
      <p className="text-center text-lg font-medium text-white">{label}</p>
    </Select.ItemText>
  </Select.Item>
);

const FormRadioGroup = ({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
}) => {
  const [selected, setSelected] = useState(options[0].value);
  return (
    <div className="flex flex-col gap-2 text-slate-900">
      <label className="text-lg font-medium">{label}</label>
      <RadioGroupPrimitive.Root
        name={name}
        required
        defaultValue={options?.[0].value}
        onValueChange={(val) => setSelected(val)}
        className="flex rounded-xl bg-white p-[6px]"
      >
        {options.map((option) => (
          <RadioItem key={option.value} {...option} selected={selected} />
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
};

const RadioItem = ({
  label,
  value,
  selected,
}: {
  selected: string;
  label: string;
  value: string;
}) => {
  const isSelected = selected === value;
  return (
    <div className="flex-1">
      <RadioGroupPrimitive.Item
        value={value}
        id={value}
        className="group relative w-full cursor-pointer px-4 py-2"
      >
        <RadioGroupPrimitive.Indicator className="absolute inset-0 rounded-md bg-slate-700" />
        <label
          className={clsx(
            "relative whitespace-nowrap text-center font-inter text-base font-medium transition-colors duration-100 ease-out",
            isSelected ? "text-white" : "text-slate-900"
          )}
          htmlFor={value}
        >
          {label}
        </label>
      </RadioGroupPrimitive.Item>
    </div>
  );
};

const FormCategories = ({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: Array<{ color: string; value: string }>;
}) => {
  return (
    <div className="flex max-w-full flex-col gap-3 text-slate-900">
      <label className="text-lg font-medium">{label}</label>
      <RadioGroupPrimitive.Root
        name={name}
        required
        defaultValue={options[0].value}
        className="flex flex-wrap gap-3"
      >
        {options.map((option) => (
          <CategoryItem key={option.value} {...option} />
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
};

const CategoryItem = ({ color, value }: { color: string; value: string }) => {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      id={value}
      className={clsx(
        "relative flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg",
        color
      )}
    >
      <RadioGroupPrimitive.Indicator className="absolute -inset-1 rounded-[10px] border-2  border-blue-400" />
      <label className="text-2xl" htmlFor={value}>
        {value}
      </label>
    </RadioGroupPrimitive.Item>
  );
};

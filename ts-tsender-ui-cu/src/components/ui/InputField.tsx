import React, { useState } from "react";

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLAreaElement>) => void;
};

export default function InputField({
  label,
  placeholder,
  value,
  type = "text",
  large = false,
  onChange,
}: InputFieldProps) {
  const inputClass = `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
    large ? "text-lg py-3" : ""
  }`;

  const [tokenAddress, setTokenAddress] = useState("");

  return (
    <div>
      {label && (
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={`input-field-${label}`}
        >
          {label}
        </label>
      )}
      <input
        className={inputClass}
        id={`input-field-${label}`}
        type={type}
        placeholder={placeholder}
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
    </div>
  );
}

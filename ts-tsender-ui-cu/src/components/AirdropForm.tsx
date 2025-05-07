"use client";
import InputField from "@/components/ui/InputField";

export default function AirDropForm() {
  return (
    <div>
      <InputField
        label="Token Address"
        placeholder="0x..."
        value=""
        onChange={() => {}}
      />
    </div>
  );
}

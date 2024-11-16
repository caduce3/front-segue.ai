import React, { forwardRef } from "react";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { Input } from "../ui/input";

// Definindo InputProps com base no tipo de input padrão
type InputProps = React.ComponentProps<"input">;

export const PhoneInput = forwardRef(
  (
    props: PatternFormatProps<InputProps>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <PatternFormat
        {...props}
        format="(##) #####-####" // Formato de telefone brasileiro
        allowEmptyFormatting={true}
        mask="-" // Máscara para espaços vazios
        customInput={Input}
        getInputRef={ref}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";

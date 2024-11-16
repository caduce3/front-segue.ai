import React, { forwardRef } from "react";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { Input } from "../ui/input";

// Tipagem para o componente Input
type InputProps = React.ComponentProps<"input">;

// Componente CepInput
export const CepInput = forwardRef(
  (
    props: PatternFormatProps<InputProps>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <PatternFormat
        {...props}
        format="#####-###" // Formato do CEP
        mask="-" // Máscara para os campos vazios
        allowEmptyFormatting={true} // Permite formatação inicial
        customInput={Input} // Componente de input customizado
        getInputRef={ref} // Referência do input
      />
    );
  }
);

CepInput.displayName = "CepInput";

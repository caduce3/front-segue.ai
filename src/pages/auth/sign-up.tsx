"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerIgreja } from "@/api/cadastrar-igreja";
import igrejaFundo from "@/assets/igrejaFundo.jpg";
import { Church, Lock, Mail, MapPin, Phone } from "lucide-react";
import { CnpjInput } from "@/components/_formatacao/cnpj-input";
import { PhoneInput } from "@/components/_formatacao/telefone-input";
import { BRAZIL_STATE_CODES } from "@/components/_constants/cep-disponiveis";
import { CepInput } from "@/components/_formatacao/cep-input";

const signUpSchema = z.object({
  nome: z.string().min(4, { message: "Pelo menos 4 caracteres." }),
  cnpj: z.string().min(14, { message: "No mínimo 14 dígitos." }),
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  senha: z.string().min(6, { message: "Pelo menos 6 caracteres." }),
  telefone: z.string().min(10, {
    message: "No mínimo 10 dígitos.",
  }),
  endereco: z.string().min(4, { message: "Pelo menos 4 caracteres." }),
  cidade: z.string().min(4, { message: "Pelo menos 4 caracteres." }),
  estado: z.string().min(2, { message: "Pelo menos 2 caracteres." }),
  cep: z.string().min(8, { message: "No mínimo 8 dígitos." }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUp() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      email: "",
      senha: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: registerIgrejaFn } = useMutation({
    mutationFn: registerIgreja,
  });

  async function onSubmit(values: SignUpFormValues) {
    setIsSubmitting(true);
    try {
      await registerIgrejaFn({
        nome: values.nome,
        cnpj: values.cnpj,
        email: values.email,
        senha: values.senha,
        telefone: values.telefone,
        endereco: values.endereco,
        cidade: values.cidade,
        estado: values.estado,
        cep: values.cep,
      });

      toast.success("Paróquia cadastrada com sucesso!");
      form.reset();
      navigate(`/sign-in?email=${values.email}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao cadastrar paróquia.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-[2fr_1fr] rounded-md p-10 w-full max-w-7xl">
      <div>
        <img
          src={igrejaFundo}
          alt="Segue.ai"
          className="h-full w-full object-cover rounded-l-lg"
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 max-w-[600px] w-[600px] flex flex-col justify-center gap-6 p-10 border h-[700px] max-h-[700px] rounded-r-lg"
        >
          <div>
            <h1 className="text-4xl font-medium">Cadastre sua igreja!</h1>
            <p className="text-sm text-muted-foreground mt-1 font-semibold">
              Preencha os dados da sua igreja para realizar o cadastro
            </p>
          </div>

          {/* Name Field */}
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Church className="left-2 top-3 h-4 w-4 text-gray-500 absolute" />
                    <Input
                      placeholder="Nome da paróquia"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <CnpjInput
                      {...field}
                      format="##.###.###/####-##"
                      placeholder="00.000.000/0000-00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Phone className="left-2 top-3 h-4 w-4 text-gray-500 absolute" />
                      <PhoneInput
                        {...field}
                        placeholder="(00) 00000-0000"
                        format="(00) 0000-0000"
                        className="pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Mail className="left-2 top-3 h-4 w-4 text-gray-500 absolute" />
                      <Input
                        placeholder="igreja@gmail.com"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Lock className="left-2 top-3 h-4 w-4 text-gray-500 absolute" />
                      <Input
                        placeholder="******"
                        className="pl-8"
                        type="password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <MapPin className="left-2 top-3 h-4 w-4 text-gray-500 absolute" />
                    <Input
                      placeholder="Rua, número, bairro"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAZIL_STATE_CODES.map((estado) => (
                          <SelectItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <CepInput
                      {...field}
                      format="#####-###"
                      placeholder="00000-000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Link
            to="/sign-in"
            className="text-right text-sm text-muted-foreground underline"
          >
            Fazer login!
          </Link>

          <Button type="submit" className="w-full font-bold">
            {isSubmitting ? "Cadastrando..." : "Cadastrar Igreja"}
          </Button>
        </form>
        <Helmet title="Cadastro" />
      </Form>
    </div>
  );
}

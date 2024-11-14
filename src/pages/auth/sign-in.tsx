"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
// import segueAi from "@/assets/segueai2.png";
import fundoSgm from "@/assets/fundoSgm2.png";

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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/sign-in";
import { signInBySector } from "@/services/sign-in-by-sector";
// import logo from "../../assets/logoTrofeu.svg";

// Define o esquema do formulário com campos de e-mail e senha
const formSchema = z.object({
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export function SignIn() {
  const [searchParams] = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function onSubmit(values: { email: string; password: string }) {
    setIsSubmitting(true);
    try {
      const token = await authenticate({
        email: values.email,
        password: values.password,
      });
      // Armazena o token no localStorage ou sessionStorage
      localStorage.setItem("authToken", token);
      const redirectURL = signInBySector(token);
      toast.success("Sucesso! Você está logado.");

      if (typeof redirectURL === "string") {
        navigate(redirectURL);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao cadastrar usuário.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-[3fr_1.5fr] rounded-md max-h-[550px]">
      <div className="max-h-[550px]">
        <img
          src={fundoSgm}
          alt="Trofeu.bet"
          className="h-full w-full object-cover rounded-l-lg"
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 max-w-[400px] w-[400px] flex flex-col justify-center gap-6 p-10 border  h-[550px] max-h-[550px] rounded-r-lg"
        >
          <div>
            <h1 className="text-4xl font-medium">Olá, seguidor!</h1>
            <p className="text-sm text-muted-foreground mt-1 font-semibold">
              Seja bem-vindo ao painel de login!
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seguidor@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link
            to="/sign-up"
            className="text-right text-sm text-muted-foreground underline"
          >
            Cadastre sua Paróquia
          </Link>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <Helmet title="Login" />
      </Form>
    </div>
  );
}

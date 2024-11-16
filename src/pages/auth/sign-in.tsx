"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
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
import { signInByPasta } from "@/services/sign-in-by-pasta";
import { Lock, Mail } from "lucide-react";

// Define o esquema do formulário com campos de e-mail e senha
const formSchema = z.object({
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export function SignIn() {
  const [searchParams] = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      senha: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function onSubmit(values: { email: string; senha: string }) {
    setIsSubmitting(true);
    try {
      const token = await authenticate({
        email: values.email,
        senha: values.senha,
      });
      // Armazena o token no localStorage ou sessionStorage
      localStorage.setItem("authToken", token);
      const redirectURL = signInByPasta(token);
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
          alt="Segue.ai"
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
              Entre com sua conta para acessar o sistema
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Mail className="left-2 top-2.5 h-4 w-4 text-gray-500 absolute" />
                    <Input
                      placeholder="seguidor@gmail.com"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Senha */}
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Lock className="left-2 top-2.5 h-4 w-4 text-gray-500 absolute" />
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link
            to="/sign-up"
            className="text-center text-sm text-muted-foreground hover:underline"
          >
            Não tem um conta?{" "}
            <span className="text-">Cadastre sua Paróquia</span>
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

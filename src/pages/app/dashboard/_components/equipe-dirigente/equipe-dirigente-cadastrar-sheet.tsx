import {
  cadastrarUserEquipeDirigente,
  CadastrarUserEquipeDirigenteBody,
} from "@/api/equipe-dirigente/cadastrar-user-equipe-dirigente";
import { OPCOES_TIPO_PASTA } from "@/components/_constants/pastas";
import { PhoneInput } from "@/components/_formatacao/telefone-input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpDown, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface cadastrarEquipeDirigenteProps {
  igrejaId: string;
}

const cadastrarEquipeDirigenteSchema = z.object({
  nome: z.string().trim().min(1, {
    message: "Nome é obrigatório",
  }),
  email: z.string().email({
    message: "Email inválido",
  }),
  senha: z.string().min(6, {
    message: "Senha deve ter no mínimo 6 caracteres",
  }),
  telefone: z.string().min(1, {
    message: "Telefone é obrigatório",
  }),
  ano: z.string().min(1, {
    message: "Ano é obrigatório",
  }),
  pasta: z.enum(
    ["PALESTRA", "FINANCAS", "MONTAGEM", "FICHAS", "PADRE", "POS"],
    {
      message: "Pasta inválida",
    }
  ),
});

type CadastrarEquipeDirigenteFormValues = z.infer<
  typeof cadastrarEquipeDirigenteSchema
>;

const CadastrarEquipeDirigenteSheet = ({
  igrejaId,
}: cadastrarEquipeDirigenteProps) => {
  const form = useForm<CadastrarEquipeDirigenteFormValues>({
    resolver: zodResolver(cadastrarEquipeDirigenteSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      ano: "",
      pasta: "PALESTRA",
    },
  });

  const { reset } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: cadastrarEquipeDirigenteFn } = useMutation({
    mutationFn: cadastrarUserEquipeDirigente,
  });

  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: CadastrarEquipeDirigenteFormValues) {
    setIsSubmitting(true);

    try {
      const payload: CadastrarUserEquipeDirigenteBody = {
        ...values,
        igrejaId,
      };

      await cadastrarEquipeDirigenteFn(payload);
      toast.success(`Pasta cadastrada com sucesso!`);

      queryClient.invalidateQueries({ queryKey: ["equipe-dirigente"] });

      reset();
      setIsOpen(false);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao cadastrar pasta.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="flex items-center justify-between w-36 sm:w-36 rounded-full font-bold"
        >
          <span className="text-xs sm:text-sm font-bold">Cadastrar ED</span>
          <UserRoundPlus className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Cadastrar pasta</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o e-mail..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite a senha..."
                      {...field}
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
                    <PhoneInput
                      {...field}
                      placeholder="(00) 00000-0000"
                      format="(00) 0000-0000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ano"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o ano (2024)..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pasta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pasta</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a pasta" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_TIPO_PASTA.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="flex flex-row justify-end">
              <SheetClose asChild>
                <Button type="button" className="mb-2 mr-2" variant="outline">
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" className="bg-primary">
                {isSubmitting ? "Cadastrando" : "Cadastrar"}
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default CadastrarEquipeDirigenteSheet;

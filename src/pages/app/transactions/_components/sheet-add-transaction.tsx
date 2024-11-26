import { getProfileUser } from "@/api/get-profile-user";
import {
  cadastrarTransaction,
  CadastrarTransactionBody,
} from "@/api/transactions/cadastrar-transaction";
import {
  OPCOES_METODO_PAGAMENTO_TRANSACAO,
  OPCOES_TIPO_TRANSACAO,
  OPCPES_CATEGORIA_TRANSACAO,
} from "@/components/_constants/transactions-traducoes";
import { MoneyInput } from "@/components/_formatacao/money-input";
import { DatePicker2 } from "@/components/date-picker";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const cadastrarTransactionSchema = z.object({
  nome: z.string().trim().min(1, {
    message: "Nome é obrigatório",
  }),
  tipo: z.enum(["DEPOSITO", "DESPESA", "INVESTIMENTO"], {
    message: "Tipo inválido",
  }),
  valor: z
    .number({
      required_error: "O valor é obrigatório",
    })
    .positive({
      message: "O valor deve ser positivo",
    }),
  categoria: z.enum(
    ["PATROCINIO", "TRANSPORTE", "DOACAO", "COMIDA", "BINGO", "OUTRO"],
    {
      message: "Categoria inválida",
    }
  ),
  metodoPagamento: z.enum(
    [
      "PIX",
      "DINHEIRO",
      "CARTAO_CREDITO",
      "CARTAO_DEBITO",
      "TRANSFERENCIA_BANCARIA",
      "BOLETO_BANCARIO",
      "OUTRO",
    ],
    {
      message: "Método de pagamento inválido",
    }
  ),
  date: z.date({
    required_error: "A data é obrigatória",
  }),
  descricao: z.string().optional(),
});

type CadastrarTransactionFormValues = z.infer<
  typeof cadastrarTransactionSchema
>;

const CadastrarTransactionDialog = () => {
  const form = useForm<CadastrarTransactionFormValues>({
    resolver: zodResolver(cadastrarTransactionSchema),
    defaultValues: {
      nome: "",
      tipo: "DEPOSITO",
      valor: 1,
      categoria: "OUTRO",
      metodoPagamento: "OUTRO",
      date: new Date(),
      descricao: "",
    },
  });

  const { data: profileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: Infinity,
  });

  let idUserEquipeDirigente = "";
  let igrejaId = "";
  if (profileUser && "igrejaId" in profileUser) {
    idUserEquipeDirigente = profileUser.id;
    igrejaId = profileUser.igrejaId;
  }

  const { reset } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: cadastrarTransactionFn } = useMutation({
    mutationFn: cadastrarTransaction,
  });

  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: CadastrarTransactionFormValues) {
    setIsSubmitting(true);

    try {
      const payload: CadastrarTransactionBody = {
        ...values,
        igrejaId,
        idUserEquipeDirigente,
      };

      await cadastrarTransactionFn(payload);
      toast.success("Transação cadastrada com sucesso!");

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("transactions"),
      });

      reset();
      setIsOpen(false);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao cadastrar transação.";
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
          className="flex items-center justify-between w-48 rounded-full font-bold"
        >
          <span className="text-sm font-bold">Adicionar Transação</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Cadastrar Transação</SheetTitle>
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
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Anotações..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="Digite o valor..."
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de transação" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_TIPO_TRANSACAO.map((option) => (
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

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCPES_CATEGORIA_TRANSACAO.map((option) => (
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

            <FormField
              control={form.control}
              name="metodoPagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pagamento</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_METODO_PAGAMENTO_TRANSACAO.map((option) => (
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

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <DatePicker2 value={field.value} onChange={field.onChange} />
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

export default CadastrarTransactionDialog;

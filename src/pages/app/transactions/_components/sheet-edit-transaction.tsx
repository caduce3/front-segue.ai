import { atualizarTransaction } from "@/api/transactions/atualizar-transaction";
import {
  pegarUnicaTransaction,
  PegarUnicaTransactionResponse,
} from "@/api/transactions/pegar-unica-transaction";
import {
  OPCOES_METODO_PAGAMENTO_TRANSACAO,
  OPCOES_TIPO_TRANSACAO,
  OPCOES_CATEGORIA_TRANSACAO,
} from "@/components/_constants/transactions-traducoes";
import { DataInput } from "@/components/_formatacao/data-input";
import { MoneyInput } from "@/components/_formatacao/money-input";
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
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editarTransactionSchema = z.object({
  nome: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  tipo: z.enum(["DEPOSITO", "DESPESA", "INVESTIMENTO"], {
    message: "Tipo inválido",
  }),
  valor: z
    .number({ required_error: "O valor é obrigatório" })
    .positive({ message: "O valor deve ser positivo" }),
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
    { message: "Método de pagamento inválido" }
  ),
  date: z.date({ required_error: "A data é obrigatória" }),
  descricao: z.string().optional(),
});

type EditarTransactionSchema = z.infer<typeof editarTransactionSchema>;

interface EditarTransactionSheetProps {
  id: string;
  idUserEquipeDirigente: string;
  igrejaId: string;
  isOpen: boolean;
  onClose: () => void;
  pasta: string;
}

const EditarTransactionSheet = ({
  id,
  idUserEquipeDirigente,
  igrejaId,
  isOpen,
  onClose,
  pasta
}: EditarTransactionSheetProps) => {
  const { data: detalhesTransaction, isLoading } = useQuery({
    queryKey: ["detalhesTransaction", id, idUserEquipeDirigente, igrejaId],
    queryFn: async () => {
      if (!id || !idUserEquipeDirigente || !igrejaId) {
        toast.error("Transação não encontrada.");
        return Promise.reject("ID da transação não encontrado.");
      }
      return pegarUnicaTransaction({ id, idUserEquipeDirigente, igrejaId });
    },
    enabled: !!id && !!idUserEquipeDirigente && !!igrejaId && isOpen,
  });

  const form = useForm<EditarTransactionSchema>({
    resolver: zodResolver(editarTransactionSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (detalhesTransaction && isOpen) {
      reset({
        nome: detalhesTransaction.transaction.nome,
        tipo: detalhesTransaction.transaction.tipo as
          | "DEPOSITO"
          | "DESPESA"
          | "INVESTIMENTO",
        valor: detalhesTransaction.transaction.valor,
        categoria: detalhesTransaction.transaction.categoria,
        metodoPagamento: detalhesTransaction.transaction.metodoPagamento,
        date: new Date(detalhesTransaction.transaction.date),
        descricao: detalhesTransaction.transaction.descricao || undefined,
      });
    }
  }, [detalhesTransaction, reset, isOpen]);

  const { mutateAsync: atualizarTransactionFn } = useMutation({
    mutationFn: atualizarTransaction,
    onSuccess(
      _,
      {
        id,
        idUserEquipeDirigente,
        igrejaId,
        metodoPagamento,
        tipo,
        categoria,
        date,
        descricao,
        nome,
        valor,
      }
    ) {
      const cached = queryClient.getQueryData<PegarUnicaTransactionResponse>([
        "detalhesTransaction",
      ]);
      if (cached) {
        queryClient.setQueryData(
          ["detalhesTransaction", id, idUserEquipeDirigente, igrejaId],
          {
            transaction: {
              ...cached.transaction,
              metodoPagamento,
              tipo,
              categoria,
              date,
              descricao,
              nome,
              valor,
            },
          }
        );
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("transactions"),
      });
    },
  });

  async function handleSubmitTransactionsEdit(data: EditarTransactionSchema) {
    try {
      await atualizarTransactionFn({
        id,
        igrejaId,
        idUserEquipeDirigente,
        ...data,
      });
      toast.success("Transação atualizada com sucesso!");
      onClose();
    } catch (error: any) {
      // Verifique se a estrutura do erro é a esperada
      let errorMessage = "Erro desconhecido ao atualizar transação.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  }

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Transação</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitTransactionsEdit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input placeholder="Digite o nome..." {...field} />
                    )}
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
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input placeholder="Anotações..." {...field} />
                    )}
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
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <MoneyInput
                        placeholder="Digite o valor..."
                        value={field.value}
                        onValueChange={({ floatValue }) =>
                          field.onChange(floatValue)
                        }
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                      />
                    )}
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
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
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
                    )}
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
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_CATEGORIA_TRANSACAO.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
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
                    )}
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
                  <FormControl>
                    <DataInput
                      placeholder="Digite a data..."
                      value={
                        field.value
                          ? new Date(field.value).toLocaleDateString("pt-BR")
                          : "" // Certificando-se de que é uma string
                      }
                      onChange={(event) => {
                        const value = event.target.value;
                        const [day, month, year] = value.split("/").map(Number);
                        const newDate = new Date(year, month - 1, day); // Convertendo para um objeto Date
                        field.onChange(newDate); // Chama o field.onChange com o objeto Date
                      }}
                      format="##/##/####"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmitting || pasta !== "FINANCAS"}>
                Salvar
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default EditarTransactionSheet;

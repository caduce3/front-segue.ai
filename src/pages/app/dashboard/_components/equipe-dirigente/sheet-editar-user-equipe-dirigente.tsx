import { atualizarUnicoUserEquipeDirigente } from "@/api/equipe-dirigente/atualizar-user-equipe-dirigente";
import {
  pegarUnicoUserEquipeDirigente,
  PegarUnicoUserEquipeDirigenteResponse,
} from "@/api/equipe-dirigente/pegar-unico-user-equipe-dirigente";
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
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editarUnicoUserEquipeDirigenteSchema = z.object({
  nome: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({
    message: "Email inválido",
  }),
  status: z.enum(["ATIVO", "INATIVO"], {
    message: "Status inválido",
  }),
  telefone: z.string().min(1, {
    message: "Telefone é obrigatório",
  }),
  ano: z.string().min(1, {
    message: "Ano é obrigatório",
  }),
  pasta: z.enum(
    ["PALESTRA", "FINANCAS", "MONTAGEM", "FICHAS", "PADRE", "POS", "PAROQUIA"],
    {
      message: "Pasta inválida",
    }
  ),
});

type EditarUnicoUserEquipeDirigenteSchema = z.infer<
  typeof editarUnicoUserEquipeDirigenteSchema
>;

interface EditarUnicoUserEquipeDirigenteSheetProps {
  id: string;
  idUserEquipeDirigente: string;
  igrejaId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditarUnicoUserEquipeDirigenteSheet = ({
  id,
  idUserEquipeDirigente,
  igrejaId,
  isOpen,
  onClose,
}: EditarUnicoUserEquipeDirigenteSheetProps) => {
  const { data: detalhesUnicoUserEquipeDirigente, isLoading } = useQuery({
    queryKey: [
      "detalhesUnicoUserEquipeDirigente",
      id,
      idUserEquipeDirigente,
      igrejaId,
    ],
    queryFn: async () => {
      if (!id || !idUserEquipeDirigente || !igrejaId) {
        toast.error("Usuário da ED não encontrado.");
        return Promise.reject("ID do usuário da ED não encontrado.");
      }
      return pegarUnicoUserEquipeDirigente({
        id,
        idUserEquipeDirigente,
        igrejaId,
      });
    },
    enabled: !!id && !!idUserEquipeDirigente && !!igrejaId && isOpen,
  });

  const form = useForm<EditarUnicoUserEquipeDirigenteSchema>({
    resolver: zodResolver(editarUnicoUserEquipeDirigenteSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (detalhesUnicoUserEquipeDirigente && isOpen) {
      reset({
        nome: detalhesUnicoUserEquipeDirigente.nome,
        email: detalhesUnicoUserEquipeDirigente.email,
        status: detalhesUnicoUserEquipeDirigente.status,
        telefone: detalhesUnicoUserEquipeDirigente.telefone,
        ano: detalhesUnicoUserEquipeDirigente.ano,
        pasta: detalhesUnicoUserEquipeDirigente.pasta,
      });
    }
  }, [detalhesUnicoUserEquipeDirigente, reset, isOpen]);

  const { mutateAsync: atualizarUnicoUserEquipeDirigenteFn } = useMutation({
    mutationFn: atualizarUnicoUserEquipeDirigente,
    onSuccess(_, { id, idUserEquipeDirigente, igrejaId }) {
      const cached =
        queryClient.getQueryData<PegarUnicoUserEquipeDirigenteResponse>([
          "detalhesUnicoUserEquipeDirigente",
        ]);
      if (cached) {
        queryClient.setQueryData(
          [
            "detalhesUnicoUserEquipeDirigente",
            id,
            idUserEquipeDirigente,
            igrejaId,
          ],
          {
            userEquipeDirigente: {
              ...cached,
            },
          }
        );
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("equipe-dirigente"),
      });
    },
  });

  async function handleSubmitUnicoUserEquipeDirigenteEdit(
    data: EditarUnicoUserEquipeDirigenteSchema
  ) {
    try {
      await atualizarUnicoUserEquipeDirigenteFn({
        id,
        igrejaId,
        idUserEquipeDirigente,
        ...data,
      });
      toast.success("Usuário da ED atualizado com sucesso!");
      onClose();
    } catch (error: any) {
      // Verifique se a estrutura do erro é a esperada
      let errorMessage = "Erro desconhecido ao atualizar usuário da ED.";
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
          <SheetTitle>Editar usuário da ED</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitUnicoUserEquipeDirigenteEdit)}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input placeholder="Email..." {...field} />
                    )}
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
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <PhoneInput
                        {...field}
                        placeholder="(00) 00000-0000"
                        format="(00) 0000-0000"
                      />
                    )}
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
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input placeholder="Ano..." {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
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
                          {/* Adicionando as opções ATIVO e INATIVO */}
                          <SelectItem key="ATIVO" value="ATIVO">
                            ATIVO
                          </SelectItem>
                          <SelectItem key="INATIVO" value="INATIVO">
                            INATIVO
                          </SelectItem>
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
              name="pasta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pasta</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
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
                    )}
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
              <Button type="submit" disabled={isSubmitting}>
                Salvar
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default EditarUnicoUserEquipeDirigenteSheet;

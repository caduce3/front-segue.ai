import { atualizarEquipeFicha } from "@/api/ficha-equipe/atualizar-equipe-ficha";
import {
  pegarUnicaEquipeFicha,
  PegarUnicaEquipeFichaResponse,
} from "@/api/ficha-equipe/pegar-unica-equipe-ficha";
import {
  OPCOES_AVALIACAO,
  OPCOES_EQUIPES,
  OPCOES_FUNCAO,
  OPCOES_TIPO_ENCONTRO,
} from "@/components/_constants/equipe-fichas-traducoes";
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

const editarEquipeFichaSchema = z.object({
  equipe: z.enum(
    [
      "ANIMACAO",
      "VIGILIA_PAROQUIAL",
      "LITURGIA",
      "CANTO",
      "ESTACIONAMENTO",
      "TAXI",
      "LANCHE",
      "COZINHA",
      "SALA",
      "FAXINA",
      "ED_PALESTRA",
      "ED_POS",
      "ED_MONTAGEM",
      "ED_FINANCAS",
      "ED_FICHAS",
      "CIRCULO",
      "GRAFICA",
      "MINI_MERCADO",
      "CARAVANA",
      "CG"
    ],
    {
      message: "Equipe inválida",
    }
  ),
  ano: z
    .string()
    .trim()
    .min(4, { message: "Ano é obrigatório" })
    .max(4, { message: "Ano é obrigatório" }),
  funcao: z.enum(["EQUIPISTA", "COORDENADOR", "ED", "APOIO"], {
    message: "Função inválida",
  }),
  avaliacao: z.enum(["NEGATIVA", "POSITIVA", "NEUTRA"], {
    message: "Função inválida",
  }),
  observacoes: z.string().nullable().optional(),
  tipoEncontro: z.enum(["PRIMEIRA_ETAPA", "CARAVANA", "SEGUNDA_ETAPA"], {
    message: "Tipo de encontro inválido",
  }),
});

type EditarEquipeFichaSchema = z.infer<typeof editarEquipeFichaSchema>;

interface EditarEquipeFichaSheetProps {
  id: string;
  idUserEquipeDirigente: string;
  igrejaId: string;
  isOpen: boolean;
  onClose: () => void;
  pasta: string;
}

const EditarEquipeFichaSheet = ({
  id,
  idUserEquipeDirigente,
  igrejaId,
  isOpen,
  onClose,
  pasta,
}: EditarEquipeFichaSheetProps) => {
  const { data: detalhesEquipeFicha, isLoading } = useQuery({
    queryKey: ["detalhesEquipeFicha", id, idUserEquipeDirigente, igrejaId],
    queryFn: async () => {
      if (!id || !idUserEquipeDirigente || !igrejaId) {
        toast.error("Equipe não encontrada nessa ficha.");
        return Promise.reject("ID da equipe não encontrado.");
      }
      return pegarUnicaEquipeFicha({ id, idUserEquipeDirigente, igrejaId });
    },
    enabled: !!id && !!idUserEquipeDirigente && !!igrejaId && isOpen,
  });

  const form = useForm<EditarEquipeFichaSchema>({
    resolver: zodResolver(editarEquipeFichaSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (detalhesEquipeFicha && isOpen) {
      reset({
        equipe: detalhesEquipeFicha.fichaEquipe.equipe,
        ano: detalhesEquipeFicha.fichaEquipe.ano,
        funcao: detalhesEquipeFicha.fichaEquipe.funcao,
        avaliacao: detalhesEquipeFicha.fichaEquipe.avaliacao,
        observacoes: detalhesEquipeFicha.fichaEquipe.observacoes,
        tipoEncontro: detalhesEquipeFicha.fichaEquipe.tipoEncontro,
      });
    }
  }, [detalhesEquipeFicha, reset, isOpen]);

  const { mutateAsync: atualizarEquipeFichaFn } = useMutation({
    mutationFn: atualizarEquipeFicha,
    onSuccess(
      _,
      {
        id,
        idUserEquipeDirigente,
        igrejaId,
        equipe,
        ano,
        funcao,
        avaliacao,
        observacoes,
        tipoEncontro,
      }
    ) {
      const cached = queryClient.getQueryData<PegarUnicaEquipeFichaResponse>([
        "detalhesEquipeFicha",
      ]);
      if (cached) {
        queryClient.setQueryData(
          ["detalhesEquipeFicha", id, idUserEquipeDirigente, igrejaId],
          {
            ficha: {
              ...cached.fichaEquipe,
              equipe,
              ano,
              funcao,
              avaliacao,
              observacoes,
              tipoEncontro,
            },
          }
        );
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("equipes-ficha"),
      });
    },
  });

  async function handleSubmitEquipeFichaEdit(data: EditarEquipeFichaSchema) {
    try {
      await atualizarEquipeFichaFn({
        id,
        igrejaId,
        idUserEquipeDirigente,
        equipe: data.equipe,
        ano: data.ano,
        funcao: data.funcao,
        avaliacao: data.avaliacao,
        observacoes: data.observacoes ?? undefined,
        tipoEncontro: data.tipoEncontro,
      });
      toast.success("Equipe atualizada com sucesso!");
      onClose();
    } catch (error: any) {
      // Verifique se a estrutura do erro é a esperada
      let errorMessage = "Erro desconhecido ao atualizar equipe.";
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
      <SheetContent side="right" className="overflow-y-auto ">
        <SheetHeader>
          <SheetTitle className="mb-5">Informações / Editar Equipe</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitEquipeFichaEdit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="tipoEncontro"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Tipo do Encontro</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo do encontro" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_TIPO_ENCONTRO.map((option) => (
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
              name="equipe"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Equipe</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a equipe" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_EQUIPES.map((option) => (
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
              name="ano"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Ano do encontro</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite o ano que fezo segue-me..."
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="funcao"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Função</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de função" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_FUNCAO.map((option) => (
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
              name="avaliacao"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Avaliação</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de avaliação" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_AVALIACAO.map((option) => (
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
              name="observacoes"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite as observações..."
                        {...field}
                        value={field.value ?? ""}
                      />
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
              <Button
                type="submit"
                disabled={isSubmitting || pasta !== "FICHAS"}
              >
                Salvar
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default EditarEquipeFichaSheet;

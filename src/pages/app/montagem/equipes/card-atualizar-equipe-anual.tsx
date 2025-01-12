import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Puzzle } from "lucide-react";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  pegarUnicaFicha,
  PegarUnicaFichaResponse,
} from "@/api/fichas/pegar-unica-ficha";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { atualizarFicha } from "@/api/fichas/atualizar-ficha";
import { queryClient } from "@/lib/react-query";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OPCOES_EQUIPES_MONTAGEM } from "@/components/_constants/equipe-fichas-traducoes";
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
} from "@/components/ui/sheet";

const atualizarEquipeAtualSchema = z.object({
  equipeAtual: z.enum(
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
      "CIRCULO",
      "GRAFICA",
      "MINI_MERCADO",
      "NENHUMA",
      "CARAVANA",
      "ED_PALESTRA",
      "ED_FICHAS",
      "ED_POS",
      "ED_FINANCAS",
      "ED_MONTAGEM",
      "CG",
    ],
    {
      message: "Equipe inválida",
    }
  ),
});

type AtualizarEquipeAtualSchema = z.infer<typeof atualizarEquipeAtualSchema>;

interface AtualizarEquipeAnualModalProps {
  id: string;
  idUserEquipeDirigente: string;
  igrejaId: string;
  isOpen: boolean;
  onClose: () => void;
  pasta: string;
}

export const AtualizarEquipeAnualModal = ({
  id,
  idUserEquipeDirigente,
  igrejaId,
  isOpen,
  onClose,
  pasta,
}: AtualizarEquipeAnualModalProps) => {
  const { data: detalhesFicha } = useQuery({
    queryKey: ["detalhesFicha", id, idUserEquipeDirigente, igrejaId],
    queryFn: async () => {
      if (!id || !idUserEquipeDirigente || !igrejaId) {
        toast.error("Ficha não encontrada.");
        return Promise.reject("ID da ficha não encontrado.");
      }
      return pegarUnicaFicha({ id, idUserEquipeDirigente, igrejaId });
    },
    enabled: !!id && !!idUserEquipeDirigente && !!igrejaId && isOpen,
  });

  const form = useForm<AtualizarEquipeAtualSchema>({
    resolver: zodResolver(atualizarEquipeAtualSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (detalhesFicha && isOpen) {
      reset({
        equipeAtual: detalhesFicha.ficha.equipeAtual,
      });
    }
  }, [detalhesFicha, reset, isOpen]);

  const { mutateAsync: atualizarFichaFn } = useMutation({
    mutationFn: atualizarFicha,
    onSuccess(_, { id, idUserEquipeDirigente, igrejaId, equipeAtual }) {
      const cached = queryClient.getQueryData<PegarUnicaFichaResponse>([
        "detalhesFicha",
      ]);
      if (cached) {
        queryClient.setQueryData(
          ["detalhesFicha", id, idUserEquipeDirigente, igrejaId],
          {
            ficha: {
              ...cached.ficha,
              equipeAtual,
            },
          }
        );
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("fichas-montagem"),
      });
    },
  });

  async function handleSubmitFichaEdit(data: AtualizarEquipeAtualSchema) {
    try {
      await atualizarFichaFn({
        id,
        igrejaId,
        idUserEquipeDirigente,
        equipeAtual: data.equipeAtual,
      });
      toast.success("Ficha montada com sucesso!");
      onClose();
    } catch (error: any) {
      // Verifique se a estrutura do erro é a esperada
      let errorMessage = "Erro desconhecido ao montar ficha.";
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
      <SheetContent side="right">
        <SheetHeader>
          <div className="flex items-start">
            <Puzzle size={24} className="text-yellow-600 pt-1 mr-2" />
            <h3 className="text-lg font-bold text-center">Montagem</h3>
          </div>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitFichaEdit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="equipeAtual"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Equipe que irá ser montado(a)</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a equipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_EQUIPES_MONTAGEM.map((option) => (
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
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isSubmitting || pasta !== "MONTAGEM"}
              >
                Confirmar
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

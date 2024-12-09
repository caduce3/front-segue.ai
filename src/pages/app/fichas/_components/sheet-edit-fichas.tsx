import { atualizarFicha } from "@/api/fichas/atualizar-ficha";
import {
  pegarUnicaFicha,
  PegarUnicaFichaResponse,
} from "@/api/fichas/pegar-unica-ficha";
import {
  OPCOES_CORES_CIRCULOS,
  OPCOES_ESCOLARIDADE,
  OPCOES_PASTORAL,
  OPCOES_SACRAMENTOS,
} from "@/components/_constants/fichas-traducoes";
import { PhoneInput } from "@/components/_formatacao/telefone-input";
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
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editarFichaSchema = z.object({
  nomePastaFichas: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  dataRecebimento: z.date(),
  nomeJovem: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  endereco: z.string(),
  dataNascimento: z.date(),
  naturalidade: z.string(),
  filiacaoPai: z.string().nullable().optional(),
  filiacaoMae: z.string().nullable().optional(),
  escolaridade: z.enum(
    [
      "DOUTORADO",
      "ENSINO_FUNDAMENTAL",
      "ENSINO_FUNDAMENTAL_INCOMPLETO",
      "ENSINO_MEDIO",
      "ENSINO_MEDIO_INCOMPLETO",
      "ENSINO_SUPERIOR_COMPLETO",
      "ENSINO_SUPERIOR_INCOMPLETO",
      "MESTRADO",
      "POS_DOUTORADO",
      "POS_GRADUACAO",
    ],
    {
      message: "Escolaridade inválida",
    }
  ),
  religiao: z.string().nullable().optional(),
  igrejaFrequenta: z.string().nullable().optional(),
  sacramentos: z.enum(["BATISMO", "CRISMA", "EUCARISTIA", "NENHUM"], {
    message: "Sacramento inválido",
  }),
  pastoral: z.enum(
    [
      "POVO_DA_RUA",
      "CARIDADE",
      "CATEQUESE",
      "COMUNICACAO",
      "FAMILIA",
      "JOVENS",
      "LITURGIA",
      "MUSICA",
      "SAUDE",
      "OUTRO",
    ],
    {
      message: "Sacramento inválido",
    }
  ),
  nomeConvidadoPor: z.string().nullable().optional(),
  telefoneConvidadoPor: z.string().nullable().optional(),
  enderecoConvidadoPor: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  anoEncontro: z.string(),
  corCirculoOrigem: z.enum(
    ["VERMELHO", "AZUL", "AMARELO", "VERDE", "LARANJA", "ROSA"],
    {
      message: "Sacramento inválido",
    }
  ),
});

type EditarFichaSchema = z.infer<typeof editarFichaSchema>;

interface EditarFichaSheetProps {
  id: string;
  idUserEquipeDirigente: string;
  igrejaId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditarFichaSheet = ({
  id,
  idUserEquipeDirigente,
  igrejaId,
  isOpen,
  onClose,
}: EditarFichaSheetProps) => {
  const { data: detalhesFicha, isLoading } = useQuery({
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

  const form = useForm<EditarFichaSchema>({
    resolver: zodResolver(editarFichaSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (detalhesFicha && isOpen) {
      reset({
        nomePastaFichas: detalhesFicha.ficha.nomePastaFichas,
        dataRecebimento: new Date(detalhesFicha.ficha.dataRecebimento),
        nomeJovem: detalhesFicha.ficha.nomeJovem,
        email: detalhesFicha.ficha.email,
        telefone: detalhesFicha.ficha.telefone,
        endereco: detalhesFicha.ficha.endereco,
        dataNascimento: new Date(detalhesFicha.ficha.dataNascimento),
        naturalidade: detalhesFicha.ficha.naturalidade,
        filiacaoPai: detalhesFicha.ficha.filiacaoPai,
        filiacaoMae: detalhesFicha.ficha.filiacaoMae,
        escolaridade: detalhesFicha.ficha
          .escolaridade as EditarFichaSchema["escolaridade"],
        religiao: detalhesFicha.ficha.religiao,
        igrejaFrequenta: detalhesFicha.ficha.igrejaFrequenta,
        sacramentos: detalhesFicha.ficha
          .sacramentos as EditarFichaSchema["sacramentos"],
        pastoral: detalhesFicha.ficha.pastoral as EditarFichaSchema["pastoral"],
        nomeConvidadoPor: detalhesFicha.ficha.nomeConvidadoPor,
        telefoneConvidadoPor: detalhesFicha.ficha.telefoneConvidadoPor,
        enderecoConvidadoPor: detalhesFicha.ficha.enderecoConvidadoPor,
        observacoes: detalhesFicha.ficha.observacoes,
        anoEncontro: detalhesFicha.ficha.anoEncontro,
        corCirculoOrigem: detalhesFicha.ficha.corCirculoOrigem,
      });
    }
  }, [detalhesFicha, reset, isOpen]);

  const { mutateAsync: atualizarFichaFn } = useMutation({
    mutationFn: atualizarFicha,
    onSuccess(
      _,
      {
        id,
        idUserEquipeDirigente,
        igrejaId,
        nomePastaFichas,
        dataRecebimento,
        nomeJovem,
        email,
        telefone,
        endereco,
        dataNascimento,
        naturalidade,
        filiacaoPai,
        filiacaoMae,
        escolaridade,
        religiao,
        igrejaFrequenta,
        sacramentos,
        pastoral,
        nomeConvidadoPor,
        telefoneConvidadoPor,
        enderecoConvidadoPor,
        observacoes,
        anoEncontro,
        corCirculoOrigem,
      }
    ) {
      const cached = queryClient.getQueryData<PegarUnicaFichaResponse>([
        "detalhesFicha",
      ]);
      if (cached) {
        queryClient.setQueryData(
          ["detalhesFicha", id, idUserEquipeDirigente, igrejaId],
          {
            ficha: {
              ...cached.ficha,
              nomePastaFichas,
              dataRecebimento,
              nomeJovem,
              email,
              telefone,
              endereco,
              dataNascimento,
              naturalidade,
              filiacaoPai,
              filiacaoMae,
              escolaridade,
              religiao,
              igrejaFrequenta,
              sacramentos,
              pastoral,
              nomeConvidadoPor,
              telefoneConvidadoPor,
              enderecoConvidadoPor,
              observacoes,
              anoEncontro,
              corCirculoOrigem,
            },
          }
        );
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("fichas"),
      });
    },
  });

  async function handleSubmitFichaEdit(data: EditarFichaSchema) {
    try {
      await atualizarFichaFn({
        id,
        igrejaId,
        idUserEquipeDirigente,
        nomePastaFichas: data.nomePastaFichas,
        dataRecebimento: data.dataRecebimento,
        nomeJovem: data.nomeJovem,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        dataNascimento: data.dataNascimento,
        naturalidade: data.naturalidade,
        filiacaoPai: data.filiacaoPai ?? undefined,
        filiacaoMae: data.filiacaoMae ?? undefined,
        escolaridade: data.escolaridade,
        religiao: data.religiao ?? undefined,
        igrejaFrequenta: data.igrejaFrequenta ?? undefined,
        sacramentos: data.sacramentos,
        pastoral: data.pastoral,
        nomeConvidadoPor: data.nomeConvidadoPor ?? undefined,
        telefoneConvidadoPor: data.telefoneConvidadoPor ?? undefined,
        enderecoConvidadoPor: data.enderecoConvidadoPor ?? undefined,
        observacoes: data.observacoes ?? undefined,
        anoEncontro: data.anoEncontro,
        corCirculoOrigem: data.corCirculoOrigem,
      });
      toast.success("Ficha atualizada com sucesso!");
      onClose();
    } catch (error: any) {
      // Verifique se a estrutura do erro é a esperada
      let errorMessage = "Erro desconhecido ao atualizar ficha.";
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
      {/* className="overflow-y-auto" */}
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Ficha</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitFichaEdit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="nomePastaFichas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jovem/Casal Fichas</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite o nome do jovem ou casal fichas..."
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
              name="dataRecebimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Recebimento</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <DatePicker2
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomeJovem"
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
                      <Input placeholder="Digite o e-mail..." {...field} />
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
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input placeholder="Digite o e-mail..." {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de nascimento</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <DatePicker2
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="naturalidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naturalidade</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite a naturalidade..."
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
              name="filiacaoPai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filiação (Pai)</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite a filiação (Pai)..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filiacaoMae"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filiação (Mãe)</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite a filiação (Mãe)..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="escolaridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolaridade</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível de escolaridade" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_ESCOLARIDADE.map((option) => (
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
              name="religiao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Religião</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite a religião..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="igrejaFrequenta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Igreja que frequenta</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite a igreja que frequenta..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sacramentos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sacramentos</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível de escolaridade" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_SACRAMENTOS.map((option) => (
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
              name="pastoral"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pastoral</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a pastoral..." />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_PASTORAL.map((option) => (
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
              name="nomeConvidadoPor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quem convidou para o encontro?</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite quem convidou para o encontro..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefoneConvidadoPor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone de quem convidou</FormLabel>
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
              name="enderecoConvidadoPor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Endereço de quem convidou para o encontro
                  </FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite o endereço de quem convidou para o encontro..."
                        {...field}
                        value={field.value ?? ""}
                      />
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
                <FormItem>
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

            <FormField
              control={form.control}
              name="anoEncontro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano do encontro</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Input
                        placeholder="Digite o ano do encontro..."
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
              name="corCirculoOrigem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do círculo de origem</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-[30px] w-[300px]" />
                    ) : (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cor do círculo de origem" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_CORES_CIRCULOS.map((option) => (
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

export default EditarFichaSheet;

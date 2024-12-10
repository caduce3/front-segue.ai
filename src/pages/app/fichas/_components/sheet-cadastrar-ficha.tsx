import {
  cadastrarFicha,
  CadastrarFichaBody,
} from "@/api/fichas/cadastrar-ficha";
import {
  OPCOES_CORES_CIRCULOS,
  OPCOES_ESCOLARIDADE,
  OPCOES_PASTORAL,
  OPCOES_SACRAMENTOS,
} from "@/components/_constants/fichas-traducoes";
import { DataInput } from "@/components/_formatacao/data-input";
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
import {  NotepadText } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CadastrarFichaSheetProps {
  igrejaId: string;
  idUserEquipeDirigente: string;
  pasta:
    | "FINANCAS"
    | "PADRE"
    | "POS"
    | "PALESTRA"
    | "PAROQUIA"
    | "MONTAGEM"
    | "FICHAS"
    | ""
}

const cadastrarFichaSchema = z.object({
  nomePastaFichas: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  dataRecebimento: z.date(),
  nomeJovem: z
    .string()
    .trim()
    .min(1, { message: "Nome do jovem é obrigatório" }),
  email: z.string().email({ message: "E-mail é obrigatório" }),
  telefone: z.string().min(10, {
    message: "No mínimo 10 dígitos.",
  }),
  endereco: z.string().min(8, { message: "No mínimo 10 dígitos." }),
  dataNascimento: z.date(),
  naturalidade: z.string().min(4, { message: "No mínimo 4 dígitos." }),
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
  anoEncontro: z.string().min(4, { message: "No mínimo 4 dígitos" }),
  corCirculoOrigem: z.enum(
    ["VERMELHO", "AZUL", "AMARELO", "VERDE", "LARANJA", "ROSA"],
    {
      message: "Sacramento inválido",
    }
  ),
});

type CadastrarFichaFormValues = z.infer<typeof cadastrarFichaSchema>;

const CadastrarFichaSheet = ({
  igrejaId,
  idUserEquipeDirigente,
  pasta,
}: CadastrarFichaSheetProps) => {
  const form = useForm<CadastrarFichaFormValues>({
    resolver: zodResolver(cadastrarFichaSchema),
    defaultValues: {
      nomePastaFichas: "",
      dataRecebimento: new Date(),
      nomeJovem: "",
      email: "",
      telefone: "",
      endereco: "",
      dataNascimento: new Date(),
      naturalidade: "",
      filiacaoPai: "",
      filiacaoMae: "",
      escolaridade: "ENSINO_MEDIO",
      religiao: "",
      igrejaFrequenta: "",
      sacramentos: "NENHUM",
      pastoral: "OUTRO",
      nomeConvidadoPor: "",
      telefoneConvidadoPor: "",
      enderecoConvidadoPor: "",
      observacoes: "",
      anoEncontro: "",
      corCirculoOrigem: "VERDE",
    },
  });

  const { reset } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: cadastrarFichaFn } = useMutation({
    mutationFn: cadastrarFicha,
  });

  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: CadastrarFichaFormValues) {
    setIsSubmitting(true);

    try {
      const payload: CadastrarFichaBody = {
        igrejaId,
        idUserEquipeDirigente,
        ...values,
        filiacaoPai: values.filiacaoPai || undefined,
        filiacaoMae: values.filiacaoMae || undefined,
        religiao: values.religiao || undefined,
        igrejaFrequenta: values.igrejaFrequenta || undefined,
        nomeConvidadoPor: values.nomeConvidadoPor || undefined,
        telefoneConvidadoPor: values.telefoneConvidadoPor || undefined,
        enderecoConvidadoPor: values.enderecoConvidadoPor || undefined,
        observacoes: values.observacoes || undefined,
      };

      await cadastrarFichaFn(payload);
      toast.success("Ficha cadastrada com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["fichas"] });

      reset();
      setIsOpen(false);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao cadastrar a ficha.";
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
          className="flex items-center justify-between w-38 sm:w-40 rounded-full font-bold"
          disabled={pasta !== "FICHAS"}
        >
          <span className="text-xs sm:text-sm font-bold">Cadastrar Ficha</span>
          <NotepadText className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="overflow-y-auto max-h-[calc(100vh-100px)]"
      >
        <SheetHeader>
          <SheetTitle>Cadastrar Ficha</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <div className="flex flex-col md:flex-row">
              <FormField
                control={form.control}
                name="nomePastaFichas"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Jovem/Casal Fichas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome do jovem ou casal fichas..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataRecebimento"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Data Recebimento</FormLabel>
                    <FormControl>
                      <DataInput
                        placeholder="Digite a data de recebimento..."
                        value={
                          field.value
                            ? new Date(field.value).toLocaleDateString("pt-BR")
                            : "" // Certificando-se de que é uma string
                        }
                        onChange={(event) => {
                          const value = event.target.value;
                          const [day, month, year] = value
                            .split("/")
                            .map(Number);
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

              <FormField
                control={form.control}
                name="nomeJovem"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
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
                name="telefone"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
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
                name="endereco"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o e-mail..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <FormField
                control={form.control}
                name="dataNascimento"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <DataInput
                        placeholder="Digite a data de nascimento..."
                        value={
                          field.value
                            ? new Date(field.value).toLocaleDateString("pt-BR")
                            : "" // Certificando-se de que é uma string
                        }
                        onChange={(event) => {
                          const value = event.target.value;
                          const [day, month, year] = value
                            .split("/")
                            .map(Number);
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

              <FormField
                control={form.control}
                name="naturalidade"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Naturalidade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a naturalidade..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="filiacaoPai"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Filiação (Pai)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a filiação (Pai)..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <FormField
                control={form.control}
                name="filiacaoMae"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Filiação (Mãe)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a filiação (Mãe)..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="escolaridade"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Escolaridade</FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="religiao"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Religião</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a religião..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <FormField
                control={form.control}
                name="igrejaFrequenta"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Igreja que frequenta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a igreja que frequenta..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sacramentos"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Sacramentos</FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pastoral"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Pastoral</FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <FormField
                control={form.control}
                name="nomeConvidadoPor"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Quem convidou para o encontro?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite quem convidou para o encontro..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefoneConvidadoPor"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Telefone de quem convidou</FormLabel>
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
                name="enderecoConvidadoPor"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>
                      Endereço de quem convidou para o encontro
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o endereço de quem convidou para o encontro..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite as observações..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anoEncontro"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Ano do encontro</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o ano do encontro..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="corCirculoOrigem"
                render={({ field }) => (
                  <FormItem className="w-full p-2">
                    <FormLabel>Cor do círculo de origem</FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancelar</Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmitting} >
                Salvar
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default CadastrarFichaSheet;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true); // Desabilita os botões
    onConfirm(); // Chama a ação de confirmação
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <h3 className="text-lg font-bold">Confirmar Exclusão</h3>
          <p>
            Tem certeza de que deseja deletar? Esta ação não pode ser desfeita.
          </p>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessing} // Desabilita o botão enquanto processa
          >
            Confirmar
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing} // Desabilita o botão enquanto processa
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

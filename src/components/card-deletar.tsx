import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { CircleX } from "lucide-react";

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
          <div className="flex items-center">
            <CircleX size={24} className="text-red-600 mr-2" />
            <h3 className="text-lg font-bold">Deseja deletar?</h3>
          </div>
          <p className="p-1 text-sm text-[#71717A]">
            Tem certeza de que deseja deletar? Esta ação não pode ser desfeita.
          </p>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing} // Desabilita o botão enquanto processa
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessing} // Desabilita o botão enquanto processa
            className="bg-red-600"
          >
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

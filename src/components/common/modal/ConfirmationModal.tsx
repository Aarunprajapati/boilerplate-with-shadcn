import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { Loader } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModalProps {
  open: boolean;
  title?: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

export interface OkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

interface ConfirmationModalProps {
  modalProps: ModalProps;
  okButtonProps?: OkButtonProps;
  children?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ConfirmationModal = ({
  modalProps,
  okButtonProps,
  children,
}: ConfirmationModalProps) => {
  const {
    open,
    title,
    okText = "OK",
    cancelText = "Cancel",
    onOk,
    onCancel,
  } = modalProps;

  const { loading, ...restOkButtonProps } = okButtonProps ?? {};

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel?.();
      }}
    >
      <DialogContent className="max-w-105 w-full flex flex-col gap-0 p-6">

        {/* Title */}
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold leading-snug">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Body / children */}
        {children && (
          <div className="mb-6 text-sm text-muted-foreground">{children}</div>
        )}

        {/* Footer — full width inside the dialog, never overflows */}
        <div className="flex w-full flex-row gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            data-testid={`modal-cancel-button-${title}`}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            className="flex-1"
            onClick={onOk}
            disabled={loading}
            data-testid={`modal-ok-button-${title}`}
            {...restOkButtonProps}
          >
            {loading && (
              <Loader className="size-4 mr-2 animate-spin" />
            )}
            {okText}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;


// ─── Usage examples ───────────────────────────────────────────────────────────
//
// Basic delete confirmation
//   <ConfirmationModal
//     modalProps={{
//       open: isDeleteModalOpen,
//       title: "Delete Confirmation",
//       okText: "Yes",
//       onOk: handleDelete,
//       onCancel: () => setIsOpen(false),
//     }}
//     okButtonProps={{ variant: "destructive", loading: isDeleting }}
//   />
//
// With body content
//   <ConfirmationModal
//     modalProps={{
//       open: isOpen,
//       title: "Are you sure?",
//       okText: "Confirm",
//       cancelText: "Go back",
//       onOk: handleConfirm,
//       onCancel: () => setIsOpen(false),
//     }}
//     okButtonProps={{ loading: isSubmitting }}
//   >
//     <p className="text-sm text-muted-foreground">
//       This action cannot be undone.
//     </p>
//   </ConfirmationModal>
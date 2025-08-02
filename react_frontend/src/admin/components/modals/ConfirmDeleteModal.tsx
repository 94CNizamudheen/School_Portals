


import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogCancel, AlertDialogAction, AlertDialogOverlay, } from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../../../components/ui/alert-dialog";

interface ConfirmDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

const ConfirmDeleteModal = ({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
}: ConfirmDeleteModalProps) => {
    return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogOverlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
      <AlertDialogContent
        className="fixed left-1/2 top-1/2 z-50 w-[50%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-red-600 dark:text-red-500">
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>

        <AlertDialogFooter className="mt-6 flex justify-end gap-3">
          <AlertDialogCancel className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteModal;

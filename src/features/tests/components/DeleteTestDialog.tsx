import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface DeleteTestDialogProps {
  isOpen: boolean;
  testName: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTestDialog({
  isOpen,
  testName,
  isLoading,
  onClose,
  onConfirm,
}: DeleteTestDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Test"
      description={`Are you sure you want to delete "${testName}"? This action cannot be undone.`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={isLoading} onClick={onConfirm}>
            Delete Test
          </Button>
        </>
      }
    />
  );
}

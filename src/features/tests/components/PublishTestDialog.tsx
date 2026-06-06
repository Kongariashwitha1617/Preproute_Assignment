import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface PublishTestDialogProps {
  isOpen: boolean;
  testName: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PublishTestDialog({
  isOpen,
  testName,
  isLoading,
  onClose,
  onConfirm,
}: PublishTestDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Test"
      description={`Are you sure you want to publish "${testName}"? Once live, students will be able to access this test.`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={onConfirm}>
            Publish Test
          </Button>
        </>
      }
    />
  );
}

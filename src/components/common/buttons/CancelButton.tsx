import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface CancelButtonProps
  extends React.ComponentProps<typeof Button> {
  onCancel?: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  className,
  onCancel,
  ...props
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCancel}
      className={cn(className)}
{...props}
    >
        Cancel
    </Button>
  );
};

export default CancelButton;
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DoneButtonProps
  extends React.ComponentProps<typeof Button> {
  loading?: boolean;
}

const DoneButton: React.FC<DoneButtonProps> = ({
  className,
  loading,
  children,
  ...props
}) => {

  return (
    <Button
      type="submit"
      disabled={loading || props.disabled}
      className={cn(className)}
      {...props}
    >
      {loading ? "Loading..." : children || "Done"}
    </Button>
  );
};

export default DoneButton;
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";
import { useTheme } from "../theme";

const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      toastOptions={{
        classNames: {
          icon: "hidden",
          toast: "font-sans"
        }
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

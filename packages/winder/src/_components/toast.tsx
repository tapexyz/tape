import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";

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

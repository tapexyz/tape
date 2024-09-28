import { Toaster as Sonner, toast } from "sonner";

const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => {
  return (
    <Sonner
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

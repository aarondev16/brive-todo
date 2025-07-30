import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return <Sonner className="w-full" {...props} />;
};

export { Toaster };

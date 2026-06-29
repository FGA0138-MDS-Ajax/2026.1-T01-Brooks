import { toast } from "sonner";

function showSuccess(message: string) {
  toast.success(message, { position: "top-right", style: { color: "oklch(60.7% 0.250 145)" } });
}

function showError(message: string) {
  toast.error(message, { position: "top-right", style: { color: "oklch(60.7% 0.250 25.214)" } });
}

const myAlert = {
    success: showSuccess,
    error: showError,
}

export default myAlert;
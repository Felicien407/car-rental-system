import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return { toast, show };
}

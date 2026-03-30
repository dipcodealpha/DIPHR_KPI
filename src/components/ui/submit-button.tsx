"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  idleText: string;
  pendingText: string;
  className?: string;
  disabled?: boolean;
}

export function SubmitButton({
  idleText,
  pendingText,
  className,
  disabled = false
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={className}
    >
      {pending ? pendingText : idleText}
    </button>
  );
}
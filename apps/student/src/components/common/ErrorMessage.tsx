interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return <p className="mt-1 text-red-500 text-xs">{message}</p>;
}

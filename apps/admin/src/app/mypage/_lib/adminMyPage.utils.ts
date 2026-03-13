import { getErrorMessage, moveToWebLogin } from "@/lib";

export const toDateText = (
  value: [number, number, number] | string | undefined,
) => {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return `${value[0]}-${String(value[1]).padStart(2, "0")}-${String(value[2]).padStart(2, "0")}`;
};

export const toResultDurationDateTime = (dateTime: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateTime)) {
    return `${dateTime}T00:00:00`;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateTime)) {
    return dateTime;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateTime)) {
    return `${dateTime}:00`;
  }

  return dateTime;
};

export { moveToWebLogin };

export const toErrorMessage = getErrorMessage;

export type InterviewPeriod = "오전" | "오후";

export type InterviewScheduleFormValues = {
  year: string;
  month: string;
  day: string;
  period: InterviewPeriod;
  hour: string;
  minute: string;
};

const sanitizeDigitsInput = (value: string, maxDigits: number) => {
  return value.replace(/\D/g, "").slice(0, maxDigits);
};

const sanitizeRangedNumericInput = (
  value: string,
  maxDigits: number,
  min: number,
  max: number,
) => {
  const digitsOnly = sanitizeDigitsInput(value, maxDigits);

  if (!digitsOnly) {
    return "";
  }

  const parsed = Number.parseInt(digitsOnly, 10);

  if (parsed < min) {
    return min.toString();
  }

  if (parsed > max) {
    return max.toString();
  }

  return parsed.toString();
};

export const sanitizeMinuteInput = (value: string) => {
  return sanitizeRangedNumericInput(value, 2, 0, 59);
};

export const sanitizeHourInput = (value: string) => {
  return sanitizeRangedNumericInput(value, 2, 1, 12);
};

export const formatMinuteForSubmit = (value: string) => {
  const sanitized = sanitizeMinuteInput(value);

  if (!sanitized) {
    return "00";
  }

  return sanitized.padStart(2, "0");
};

export const formatHourForSubmit = (value: string) => {
  const sanitized = sanitizeHourInput(value);

  if (!sanitized) {
    return 12;
  }

  return Number.parseInt(sanitized, 10);
};

export const sanitizeYearInput = (value: string) => {
  return sanitizeDigitsInput(value, 4);
};

export const sanitizeMonthInput = (value: string) => {
  return sanitizeRangedNumericInput(value, 2, 1, 12);
};

export const sanitizeDayInput = (value: string) => {
  return sanitizeRangedNumericInput(value, 2, 1, 31);
};

export const isValidInterviewDate = ({
  year,
  month,
  day,
}: Pick<InterviewScheduleFormValues, "year" | "month" | "day">) => {
  if (year.length !== 4 || !month || !day) {
    return false;
  }

  const parsedYear = Number.parseInt(year, 10);
  const parsedMonth = Number.parseInt(month, 10);
  const parsedDay = Number.parseInt(day, 10);

  const date = new Date(parsedYear, parsedMonth - 1, parsedDay);

  return (
    date.getFullYear() === parsedYear &&
    date.getMonth() === parsedMonth - 1 &&
    date.getDate() === parsedDay
  );
};

export const parseInterviewScheduleFormValues = (
  interviewSchedule: string,
  interviewTime: string,
): InterviewScheduleFormValues => {
  const [year, month, day] = interviewSchedule.split("-");
  const [hour24Str, minute] = interviewTime.split(":");
  const hour24 = Number.parseInt(hour24Str, 10);

  if (hour24 === 0) {
    return {
      year,
      month,
      day,
      period: "오전",
      hour: "12",
      minute,
    };
  }

  if (hour24 < 12) {
    return {
      year,
      month,
      day,
      period: "오전",
      hour: hour24.toString(),
      minute,
    };
  }

  if (hour24 === 12) {
    return {
      year,
      month,
      day,
      period: "오후",
      hour: "12",
      minute,
    };
  }

  return {
    year,
    month,
    day,
    period: "오후",
    hour: (hour24 - 12).toString(),
    minute,
  };
};

export const buildInterviewSchedulePayload = ({
  year,
  month,
  day,
  period,
  hour,
  minute,
}: InterviewScheduleFormValues) => {
  let hour24 = formatHourForSubmit(hour);

  if (period === "오후" && hour24 !== 12) {
    hour24 += 12;
  } else if (period === "오전" && hour24 === 12) {
    hour24 = 0;
  }

  return {
    interviewSchedule: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
    interviewTime: `${hour24.toString().padStart(2, "0")}:${formatMinuteForSubmit(minute)}`,
  };
};

export const formatInterviewTimeForDisplay = (interviewTime: string) => {
  const { period, hour } = parseInterviewScheduleFormValues(
    "2000-01-01",
    interviewTime,
  );

  return `${period} ${hour}시`;
};

export const formatInterviewDateForDisplay = (interviewSchedule: string) => {
  const [year, month, day] = interviewSchedule.split("-");
  return `${year}.${month}.${day}`;
};

export const selectAllInputText = (input: HTMLInputElement) => {
  requestAnimationFrame(() => input.select());
};

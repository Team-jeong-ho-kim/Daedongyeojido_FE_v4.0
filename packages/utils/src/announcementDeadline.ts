const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const COMPACT_DATE_ONLY_PATTERN = /^(\d{4})(\d{2})(\d{2})$/;
const DOTTED_DATE_ONLY_PATTERN = /^(\d{4})\.(\d{2})\.(\d{2})$/;

type AnnouncementDeadlineInput =
  | string
  | [number, number, number]
  | null
  | undefined;

const createEndOfDayDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day, 23, 59, 59, 999);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

export const getAnnouncementDeadlineEnd = (
  deadline: AnnouncementDeadlineInput,
): Date | null => {
  if (!deadline) {
    return null;
  }

  if (Array.isArray(deadline) && deadline.length === 3) {
    const [year, month, day] = deadline;
    return createEndOfDayDate(year, month, day);
  }

  if (typeof deadline !== "string") {
    return null;
  }

  const trimmedDeadline = deadline.trim();
  const dateOnlyMatch =
    trimmedDeadline.match(DATE_ONLY_PATTERN) ??
    trimmedDeadline.match(COMPACT_DATE_ONLY_PATTERN) ??
    trimmedDeadline.match(DOTTED_DATE_ONLY_PATTERN);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return createEndOfDayDate(
      Number.parseInt(year, 10),
      Number.parseInt(month, 10),
      Number.parseInt(day, 10),
    );
  }

  const parsedDate = new Date(trimmedDeadline);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

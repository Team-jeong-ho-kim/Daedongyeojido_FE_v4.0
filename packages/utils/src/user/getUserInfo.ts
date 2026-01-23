export const getUserInfo = (): {
  classNumber: string | null;
  userName: string | null;
} => {
  if (typeof window === "undefined")
    return { classNumber: null, userName: null };
  const classNumber = localStorage.getItem("class_number");
  const userName = localStorage.getItem("user_name");

  return { classNumber, userName };
};

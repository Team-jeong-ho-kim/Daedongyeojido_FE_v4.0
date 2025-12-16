import { Button } from "ui";

export default function StudentPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl">Student</h1>
        <p className="mb-6 text-muted-foreground">학생</p>
        <Button>시작하기</Button>
      </div>
    </div>
  );
}

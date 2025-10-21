import { Button } from "ui";

export default function StudentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Student</h1>
        <p className="text-muted-foreground mb-6">학생</p>
        <Button>시작하기</Button>
      </div>
    </div>
  );
}

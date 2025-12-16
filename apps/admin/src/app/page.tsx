import { Button } from "ui";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl">Admin</h1>
        <p className="mb-6 text-muted-foreground">관리자</p>
        <Button variant="secondary">관리하기</Button>
      </div>
    </div>
  );
}

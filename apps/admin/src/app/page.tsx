import { Button } from "ui";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Admin</h1>
        <p className="text-muted-foreground mb-6">관리자</p>
        <Button variant="secondary">관리하기</Button>
      </div>
    </div>
  );
}

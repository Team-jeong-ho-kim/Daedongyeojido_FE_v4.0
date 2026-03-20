import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("*/__test__/health", () => {
    return HttpResponse.json({ ok: true });
  }),
];

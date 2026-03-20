const adminApiMocks = vi.hoisted(() => ({
  getResultDuration: vi.fn(),
}));

vi.mock("@/api/admin", () => ({
  getResultDuration: adminApiMocks.getResultDuration,
}));

import { loadAdminOverviewData } from "./loadAdminOverviewData";

describe("loadAdminOverviewData", () => {
  it("returns the result duration response when the request succeeds", async () => {
    adminApiMocks.getResultDuration.mockResolvedValueOnce({
      endDateTime: "2026-03-21T12:00:00",
      startDateTime: "2026-03-21T09:00:00",
    });

    await expect(loadAdminOverviewData()).resolves.toEqual({
      resultDurationInfo: {
        endDateTime: "2026-03-21T12:00:00",
        startDateTime: "2026-03-21T09:00:00",
      },
    });
  });

  it("returns null when the request fails", async () => {
    adminApiMocks.getResultDuration.mockRejectedValueOnce(new Error("boom"));

    await expect(loadAdminOverviewData()).resolves.toEqual({
      resultDurationInfo: null,
    });
  });
});

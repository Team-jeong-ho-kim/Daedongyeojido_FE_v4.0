import { getAnnouncementDeadlineEnd } from "../announcementDeadline";

describe("getAnnouncementDeadlineEnd", () => {
  it("returns the local end of day for tuple deadlines", () => {
    const deadline = getAnnouncementDeadlineEnd([2026, 3, 29]);

    expect(deadline).not.toBeNull();
    expect(deadline?.getFullYear()).toBe(2026);
    expect(deadline?.getMonth()).toBe(2);
    expect(deadline?.getDate()).toBe(29);
    expect(deadline?.getHours()).toBe(23);
    expect(deadline?.getMinutes()).toBe(59);
    expect(deadline?.getSeconds()).toBe(59);
    expect(deadline?.getMilliseconds()).toBe(999);
  });

  it("returns the local end of day for YYYY-MM-DD deadlines", () => {
    const deadline = getAnnouncementDeadlineEnd("2026-03-29");

    expect(deadline).not.toBeNull();
    expect(deadline?.getFullYear()).toBe(2026);
    expect(deadline?.getMonth()).toBe(2);
    expect(deadline?.getDate()).toBe(29);
    expect(deadline?.getHours()).toBe(23);
    expect(deadline?.getMinutes()).toBe(59);
    expect(deadline?.getSeconds()).toBe(59);
    expect(deadline?.getMilliseconds()).toBe(999);
  });

  it("keeps the original time when a datetime string is provided", () => {
    const deadline = getAnnouncementDeadlineEnd("2026-03-29T10:30:00");

    expect(deadline).not.toBeNull();
    expect(deadline?.getFullYear()).toBe(2026);
    expect(deadline?.getMonth()).toBe(2);
    expect(deadline?.getDate()).toBe(29);
    expect(deadline?.getHours()).toBe(10);
    expect(deadline?.getMinutes()).toBe(30);
    expect(deadline?.getSeconds()).toBe(0);
    expect(deadline?.getMilliseconds()).toBe(0);
  });

  it("returns null for invalid inputs", () => {
    expect(getAnnouncementDeadlineEnd("invalid-deadline")).toBeNull();
    expect(getAnnouncementDeadlineEnd([2026, 2, 30])).toBeNull();
  });
});

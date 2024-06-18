import { describe, it, expect, vi, beforeEach } from "vitest";
import template from "../../src/commands/template";
import gitService from "../../src/services/git";
import fileService from "../../src/services/files";

vi.mock("../../src/services/git");
vi.mock("../../src/services/files");

describe("template command", () => {
  beforeEach(() => void vi.resetAllMocks());

  it("does nothing if not a git repo", async () => {
    vi.mocked(gitService.isRepo).mockResolvedValueOnce(false);

    await template();
    expect(gitService.getAuthors).not.toHaveBeenCalled();
  });

  it("should append 5 of authors if not specified", async () => {
    vi.mocked(gitService.isRepo).mockResolvedValueOnce(true);
    vi.mocked(gitService.getAuthors).mockResolvedValueOnce([
      "user user@example.dev",
      "user2 user@example.dev",
      "user3 user@example.dev",
      "user4 user@example.dev",
      "user5 user@example.dev",
      "user6 user@example.dev",
    ]);
    const appendToFileMock = vi
      .spyOn(fileService, "appendToFile")
      .mockResolvedValue();

    await template();

    expect(appendToFileMock).toHaveBeenCalledOnce();
    expect(appendToFileMock.mock.calls[0][1]).toContain(
      "user5 user@example.dev"
    );
    expect(appendToFileMock.mock.calls[0][1]).not.toContain(
      "user6 user@example.dev"
    );
  });

  it("should append right amount of authors", async () => {
    vi.mocked(gitService.isRepo).mockResolvedValueOnce(true);
    vi.mocked(gitService.getAuthors).mockResolvedValueOnce([
      "user user@example.dev",
      "user2 user@example.dev",
      "user3 user@example.dev",
      "user4 user@example.dev",
    ]);
    const appendToFileMock = vi
      .spyOn(fileService, "appendToFile")
      .mockResolvedValue();

    await template(3);

    expect(appendToFileMock).toHaveBeenCalledOnce();
    expect(appendToFileMock.mock.calls[0][1]).toContain(
      "user user@example.dev"
    );
    expect(appendToFileMock.mock.calls[0][1]).not.toContain(
      "user4 user@example.dev"
    );
  });

  it("should remove bots from the authors list", async () => {
    vi.mocked(gitService.isRepo).mockResolvedValueOnce(true);
    vi.mocked(gitService.getAuthors).mockResolvedValueOnce([
      "user user@example.dev",
      "user2 user[bot]@example.dev",
      "user3 user@example.dev",
    ]);
    const appendToFileMock = vi
      .spyOn(fileService, "appendToFile")
      .mockResolvedValue();

    await template(3);

    expect(appendToFileMock).toHaveBeenCalledOnce();
    expect(appendToFileMock.mock.calls[0][1]).toContain(
      "user user@example.dev"
    );
    expect(appendToFileMock.mock.calls[0][1]).not.toContain("user2");
  });
});

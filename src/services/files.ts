import { $ } from "execa";
import { appendFile, readFile, writeFile } from "fs/promises";

type FileService = {
  getWorkingDirectory: () => Promise<string>;
  appendToFile: (path: string, content: string) => Promise<void>;
  removeAuthors: (path: string) => Promise<void>;
};

async function getWorkingDirectory() {
  return (await $`pwd`).stdout;
}

async function appendToFile(path: string, content: string) {
  await appendFile(path, content);
}

async function removeAuthors(path: string) {
  const fileContent = (await readFile(path)).toString();
  const cleanedContent = fileContent
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("# Comment out below:") &&
        !line.startsWith("#Co-authored-by: ")
    );

  await writeFile(path, cleanedContent.join("\n").trimStart());
}

const service: FileService = {
  getWorkingDirectory,
  appendToFile,
  removeAuthors,
};
export default service;

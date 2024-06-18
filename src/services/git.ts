import { $ } from "execa";

type GitService = {
  isRepo: () => Promise<boolean>;
  getOwnEmail: () => Promise<string>;
  getAuthors: () => Promise<string[]>;
  setTemplate: (template: string) => Promise<void>;
};

async function isRepo() {
  try {
    await $`git rev-parse --git-dir`;
    try {
      await $`git log`;
      return true;
    } catch {
      console.warn("This repo does not have any commits yet");
      return false;
    }
  } catch {
    console.warn("This is not a git repo.");
    return false;
  }
}

async function getOwnEmail() {
  return (await $`git config user.email`).stdout;
}

async function getAuthors() {
  return (await $`git shortlog -sne`).stdout
    .split("\n")
    .map((line) => line.trim().split("\t")[1]);
}

async function setTemplate(template: string) {
  $`git config commit.template ${template}`;
}

const service: GitService = { isRepo, getAuthors, setTemplate, getOwnEmail };
export default service;

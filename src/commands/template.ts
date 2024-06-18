import gitService from "../services/git";
import fileService from "../services/files";

export default async function template(n?: number) {
  if (!(await gitService.isRepo())) return;

  const authors = await gitService.getAuthors();
  const email = await gitService.getOwnEmail();
  await appendToGitTemplate(
    authors
      .filter(isNotBot)
      .filter(isNotSelf(email))
      .slice(0, n || 5)
  );
}

async function appendToGitTemplate(authors: string[]) {
  if (authors.length === 0) {
    console.warn("not enough authors in git log");
    return;
  }

  const template =
    (await fileService.getWorkingDirectory()) + "/.git/.gittemplate.txt";

  await gitService.setTemplate(template);
  await fileService.removeAuthors(template);
  await fileService.appendToFile(
    template,
    "\n# Comment out below:\n" +
      authors.map((author) => "#Co-authored-by: " + author).join("\n") +
      "\n"
  );
}

function isNotBot(author: string) {
  return !author.includes("[bot]");
}

function isNotSelf(email: string) {
  return (author: string) => !author.includes(email);
}

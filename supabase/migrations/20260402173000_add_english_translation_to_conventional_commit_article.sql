update public.articles
set translations = coalesce(translations, '{}'::jsonb) || $translations$
{
  "en": {
    "title": "Understanding Conventional Commit Messages in Git",
    "excerpt": "A simple explanation of conventional commit messages in Git, from the basic format and common types to practical examples that are easy for beginners to understand.",
    "readTime": "9 min read",
    "category": "Git Basics",
    "imageAlt": "Illustration for an article about conventional commit messages in Git",
    "sections": [
      {
        "type": "paragraph",
        "content": "If you are new to Git, writing commit messages can feel confusing. Many people end up using messages like update, fix again, or quick bug fix. The problem is that messages like those are too vague."
      },
      {
        "type": "paragraph",
        "content": "Other people cannot easily tell what changed, and even you might forget what you meant a few weeks later. That is where conventional commit messages become useful."
      },
      {
        "type": "heading",
        "content": "What is a commit message?"
      },
      {
        "type": "paragraph",
        "content": "A commit message is a short note that explains the change you save in Git."
      },
      {
        "type": "list",
        "items": [
          "adding a login button",
          "fixing a bug during registration",
          "changing the navbar color",
          "removing an unused file"
        ]
      },
      {
        "type": "paragraph",
        "content": "So every time you create a commit, you are basically telling the team what you just did in the project."
      },
      {
        "type": "heading",
        "content": "What is a conventional commit?"
      },
      {
        "type": "paragraph",
        "content": "A conventional commit is a way to write commit messages in a tidy and consistent format."
      },
      {
        "type": "paragraph",
        "content": "The goal is to make commit history easier to read, easier to search, easier for the team to understand, and more professional overall."
      },
      {
        "type": "paragraph",
        "content": "The most common format looks like this:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "type: short message"
      },
      {
        "type": "paragraph",
        "content": "For example:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "feat: add login feature\nfix: resolve email validation bug\ndocs: update README"
      },
      {
        "type": "heading",
        "content": "Why are conventional commits important?"
      },
      {
        "type": "paragraph",
        "content": "Imagine your project is being worked on by many people. If everyone writes commits however they want, the history becomes messy very quickly."
      },
      {
        "type": "paragraph",
        "content": "Here are examples that are not clear enough:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "update\nrevision\nfixed\nfinal fix\nfix again seriously this is the fix"
      },
      {
        "type": "paragraph",
        "content": "From messages like that, you cannot tell what changed, which part changed, whether it was a new feature or a bug fix, or whether the change was important."
      },
      {
        "type": "paragraph",
        "content": "With conventional commits, everything becomes clearer."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "feat: add profile page\nfix: repair submit button that does not work\nstyle: tidy navbar spacing\nrefactor: simplify login logic"
      },
      {
        "type": "paragraph",
        "content": "At a glance, people immediately understand the change."
      },
      {
        "type": "heading",
        "content": "The structure of a conventional commit"
      },
      {
        "type": "paragraph",
        "content": "The common format usually looks like this:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "type(scope): message"
      },
      {
        "type": "paragraph",
        "content": "Or the simpler version:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "type: message"
      },
      {
        "type": "heading",
        "content": "Breaking down the parts"
      },
      {
        "type": "heading",
        "content": "1. type"
      },
      {
        "type": "paragraph",
        "content": "This part explains the kind of change you made."
      },
      {
        "type": "list",
        "items": [
          "feat: add a new feature",
          "fix: repair a bug",
          "docs: change documentation",
          "style: adjust formatting or appearance, not logic",
          "refactor: clean up code without changing the main behavior",
          "test: add or update tests",
          "chore: supporting work such as dependency updates"
        ]
      },
      {
        "type": "heading",
        "content": "2. scope (optional)"
      },
      {
        "type": "paragraph",
        "content": "Scope explains where the change happened."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "feat(auth): add Google login\nfix(cart): repair total price calculation"
      },
      {
        "type": "paragraph",
        "content": "In that example, auth and cart are the scopes. If your project is still simple, this part is optional."
      },
      {
        "type": "heading",
        "content": "3. message"
      },
      {
        "type": "paragraph",
        "content": "This part explains what changed, and it should stay short and clear."
      },
      {
        "type": "paragraph",
        "content": "A good example:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "fix: repair phone number validation"
      },
      {
        "type": "paragraph",
        "content": "A weak example:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "fix: bug"
      },
      {
        "type": "heading",
        "content": "Common conventional commit types"
      },
      {
        "type": "heading",
        "content": "feat"
      },
      {
        "type": "paragraph",
        "content": "Use feat when you add a new feature."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "feat: add reset password feature"
      },
      {
        "type": "paragraph",
        "content": "That means you are adding a new capability to the application."
      },
      {
        "type": "heading",
        "content": "fix"
      },
      {
        "type": "paragraph",
        "content": "Use fix when you correct a bug or error."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "fix: repair image upload error"
      },
      {
        "type": "paragraph",
        "content": "That means a previous issue has now been resolved."
      },
      {
        "type": "heading",
        "content": "docs"
      },
      {
        "type": "paragraph",
        "content": "Use docs when the change is only about documentation."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "docs: update installation steps in README"
      },
      {
        "type": "heading",
        "content": "style"
      },
      {
        "type": "paragraph",
        "content": "Use style when you change formatting or visual appearance but not program logic."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "style: tidy indentation on the dashboard page"
      },
      {
        "type": "heading",
        "content": "refactor"
      },
      {
        "type": "paragraph",
        "content": "Use refactor when you reorganize or clean code without changing the final behavior."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "refactor: simplify discount calculation"
      },
      {
        "type": "heading",
        "content": "test"
      },
      {
        "type": "paragraph",
        "content": "Use test when you add or update tests."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "test: add unit test for login service"
      },
      {
        "type": "heading",
        "content": "chore"
      },
      {
        "type": "paragraph",
        "content": "Use chore for supporting work that is not a feature and not a bug fix."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "chore: update react dependency to the latest version"
      },
      {
        "type": "heading",
        "content": "Examples of good commit messages"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "feat: add checkout page\nfix: repair automatic logout bug\ndocs: add project setup guide\nstyle: tidy login button appearance\nrefactor: move auth logic into a service\ntest: add tests for the register API\nchore: update eslint package"
      },
      {
        "type": "heading",
        "content": "Examples of weak commit messages"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "update\nfix\nrevision\nsmall fix\nsafe now\nfinal"
      },
      {
        "type": "paragraph",
        "content": "Those are weak because they are too general. Other people cannot understand what the actual change was."
      },
      {
        "type": "heading",
        "content": "Tips for writing better conventional commits"
      },
      {
        "type": "heading",
        "content": "1. Keep it short, but clear"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "fix: repair login form validation"
      },
      {
        "type": "paragraph",
        "content": "Do not make it too long, but do not make it vague either."
      },
      {
        "type": "heading",
        "content": "2. Focus on what changed"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "feat: add product filter by category"
      },
      {
        "type": "paragraph",
        "content": "Write the change itself, not the whole story of how you arrived there."
      },
      {
        "type": "heading",
        "content": "3. Use consistent words"
      },
      {
        "type": "paragraph",
        "content": "If your team uses feat, do not randomly switch to feature. If your team uses fix, do not mix it with bugfix unless the team has agreed on that convention."
      },
      {
        "type": "heading",
        "content": "4. One commit, one main purpose"
      },
      {
        "type": "paragraph",
        "content": "As much as possible, one commit should contain one main kind of change. For example, do not mix a new checkout feature, a login bug fix, and a README update in one giant commit."
      },
      {
        "type": "heading",
        "content": "A real-world example"
      },
      {
        "type": "paragraph",
        "content": "Imagine that today you added a registration feature, fixed the login button, and updated the project documentation. Your commits could look like this:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "feat: add user registration feature\nfix: repair login button that does not respond\ndocs: update project installation guide"
      },
      {
        "type": "paragraph",
        "content": "That is much cleaner and easier to understand."
      },
      {
        "type": "heading",
        "content": "Is conventional commit mandatory?"
      },
      {
        "type": "paragraph",
        "content": "Not always. If you work alone on a very small project, a casual commit style can still work."
      },
      {
        "type": "paragraph",
        "content": "But if you work in a team, your project is growing, you want a cleaner and more professional history, or you want the Git history to stay easy to read, then conventional commits are strongly recommended."
      },
      {
        "type": "heading",
        "content": "Conclusion"
      },
      {
        "type": "paragraph",
        "content": "A conventional commit is a way to write commit messages in a clear and consistent format."
      },
      {
        "type": "code",
        "language": "bash",
        "code": "type: message"
      },
      {
        "type": "paragraph",
        "content": "For example:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "feat: add login feature\nfix: repair registration bug\ndocs: update README"
      },
      {
        "type": "paragraph",
        "content": "With this approach, your Git history becomes cleaner, easier to read, easier for the team to understand, and easier for your future self as well."
      },
      {
        "type": "highlight",
        "title": "The point",
        "content": "Conventional commit is not about looking fancy. It is about clear communication inside a project."
      }
    ]
  }
}
$translations$::jsonb
where slug = 'mengenal-conventional-commit-message-di-git';

#GIT Commands

# Set your contributor config variables
- - -
**git config --global user.name `full_name_here`**
---
* Set your name for when you contribute to the project.

**git config --global user.email `email_here`**
---
* Set your email for when you contribute to the project.



# Before working on a project check for any updates
- - -
**git remote update**
---
* Run this command to update the pointer to the remote repository.

**git status -uno**
---
* Run this command to list any changes made to the remote repository.



# Push your changes to the remote repository
- - -
**git status**
---
* Displays a list of modified files and if any have been added to a commit.

**git add `file_name`**
---
* Add the specified file to the commit list.
* Use `-A` to add **all** the modified/added files to the commit.

**git commit -m `message_here`**
---
* Creates a commit with the files specified and a message to go along.

**git push origin master**
---
* Push your committed changes up to the master branch.



# Working with branches
- - -
**git branch**
---
* Lists all the branches found on the local and remote repo.

**git checkout -b `branch_name`**
---
* Will switch to the branch specified and create it if not found.

**git push origin `branch_name`**
---
* Pushes committed changes onto the remote server under the specified branch.

**git checkout `branch_name` -- `file_to_update`**
---
* This will copy a file from the specified branch to the current working branch.

**git push origin :`branch_name`**
---
* Deletes the branch on the remote repository.

**git remote prune origin**
---
* Delete branches from local repo which no longer exist on the remote repo.

**git branch -D `branch_name`**
---
* Deletes the branch specified even if changes were made.
* use `-d` to check for changes before deleting.



# Useful commands
- - -
**git clone `repo_url`**
---
* Copies a remote repository. Ensure the URL ends with a _git_ extension.

**git checkout -- `file_name`**
---
* Discard changes to the local file.

**git checkout -- .**
---
* Discard all changes made to the local repo.

**git commit -a -m `message_here`**
---
* Shortcut that automatically adds all modified files and a commit message.
* If created new files must use `git add -A` first.

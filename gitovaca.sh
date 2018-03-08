git checkout --orphan newBranch
git add -A  # Add all files and commit them
git commit -m "init"
git branch -D master  # Deletes the master branch
git branch -m master  # Rename the current branch to master

#!/bin/bash

# Check if there are changes to commit
if [[ -n $(git status --porcelain) ]]; then
    # Stage all changes
    git add .

    # Commit with a timestamp
    git commit -m "Auto commit: $(date +'%Y-%m-%d %H:%M:%S')"

    # Push to main branch
    git push origin main

    echo "Changes pushed successfully!"
else
    echo "No changes to commit. Working tree clean."
fi

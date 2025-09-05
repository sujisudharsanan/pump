#!/bin/bash

# Add all changes
git add .

# Commit with a timestamp message
git commit -m "Auto commit: $(date +'%Y-%m-%d %H:%M:%S')"

# Push to main branch
git push origin main

#!/bin/bash

cd ..;

# Run cloc to count lines of code
result=$(cloc AWI_project_frontend --exclude-dir=.idea,dist,node_modules,-vscode,.firebase,.angular --exclude-ext=json --git --md --quiet --hide-rate;)

# Remove the first and second line
result=$(echo "$result" | sed '1,2d')

# Replace "SUM:" with "Total"
result=$(echo "$result" | sed 's/SUM:/Total/')

# Get the current date and time
date_time=$(date +"%Y-%m-%d %H:%M:%S")

# Make the date_markdown variable
if [ ! -f AWI_project_frontend/linecount.md ]; then
    date_markdown="### Date : $date_time\n\n---\n"
else
    date_markdown="\n---\n\n# Date : $date_time\n\n---\n"
fi

# Append the result to the date_markdown
result="$date_markdown$result"

# Append the result to the linecount.md file
echo -e "$result" >> AWI_project_frontend/linecount.md

kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Item Inspector
# Requirements
#   Host: servera
#   Script location: /home/student/scripts/item_inspector.sh
#   Inspect each path a backup job was told to collect
#   Report each path as a regular file, a directory, or neither
#   Every path must produce exactly one message
# Steps
#   1. Create a basic script file
#   2. Make it executable and run it
#   3. Loop over a list of paths and print each one
#   4. Report the paths that are regular files
#   5. Add a branch for directories, then a final branch for everything else
#   6. Confirm that every item in the list produces exactly one message
clear

#^ 1. Create a basic script file
mkdir -p ~/scripts
cd ~/scripts
vim item_inspector.sh
#! Students' vim adds # after the hashbang; Enter, Backspace, Enter clears it
i#!/bin/bash
#@ pause 5
#@ noenter
echo "Starting $0"
#@ key escape
:wq
clear

#^ 2. Make it executable and run it
chmod a+x item_inspector.sh
./item_inspector.sh
clear

#^ 3. Loop over a list of paths and print each one
#! The backup job lists a directory, a file, and a path that no longer exists
vim item_inspector.sh
/Starting \$0
#@ noenter
o
for item in /etc/skel /etc/passwd /srv/nightly-backup; do
    echo "$item"
#@ pause 5
#@ noenter
done
#@ key escape
:wq
./item_inspector.sh
clear

#^ 4. Report the paths that are regular files
#! Replace the bare echo so each path produces one message, not two
vim item_inspector.sh
/echo "\$item"
#@ noenter
dd
#@ noenter
O
    if [[ -f "$item" ]]; then
        echo "$item is a file"
#@ pause 5
#@ noenter
    fi
#@ key escape
:wq
./item_inspector.sh
#! Only one path is reported; the other two produce no message at all
clear

#^ 5. Add a branch for directories, then a final branch for everything else
vim item_inspector.sh
/is a file
#@ noenter
o
    elif [[ -d "$item" ]]; then
#@ pause 5
#@ noenter
        echo "$item is a directory"
#@ key escape
:wq
./item_inspector.sh
clear
vim item_inspector.sh
/is a directory
#@ noenter
o
    else
#@ pause 5
#@ noenter
        echo "$item is neither a file nor a directory"
#@ key escape
:wq
#@ pause 5
cat item_inspector.sh
clear

#^ 6. Confirm that every item in the list produces exactly one message
#@ pause 5
./item_inspector.sh
#! Every path now produces exactly one message, as the requirement asked
clear

#^ Clean up
#! Nothing later uses this script
\rm ~/scripts/item_inspector.sh

# Complete

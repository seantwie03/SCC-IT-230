kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Item Inspector
# Requirements
#   Host: servera
#   Script location: /home/student/scripts/backup_auditor.sh
#   Inspect each path a backup job was told to collect
#   Report each path as a regular file, a directory, or neither
#   Every path must produce exactly one message
# Tasks
#   1. Create a basic script file
#   2. Make it executable
#   3. Write a basic for loop
#   4. Report the regular files
#   5. Add branches for directories and everything else
#   6. Clean up
clear

#^ 1. Create a basic script file
mkdir -p ~/scripts
cd ~/scripts
vim backup_auditor.sh
#! Press enter, backspace, enter after the next command.
i#!/bin/bash
#@ pause 5
#@ noenter
echo "Starting $0"
#@ key escape
:wq

#^ 2. Make it executable
chmod a+x backup_auditor.sh
./backup_auditor.sh
clear

#^ 3. Write a basic for loop
#! The backup job lists a directory, a file, and a path that no longer exists.
vim backup_auditor.sh
/Starting \$0
o
for item in /etc/skel /etc/passwd /srv/nightly-backup; do
    echo "$item"
#@ pause 5
#@ noenter
done
#@ key escape
:wq
./backup_auditor.sh
clear

#^ 4. Report the regular files
#! Replace the bare echo so each path produces one message, not two.
vim backup_auditor.sh
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
./backup_auditor.sh
#! Only one path is reported. The other two produce no message at all.
clear

#^ 5. Add branches for directories and everything else
vim backup_auditor.sh
/is a file
#@ noenter
o
    elif [[ -d "$item" ]]; then
#@ pause 5
#@ noenter
        echo "$item is a directory"
#@ key escape
:wq
./backup_auditor.sh
clear
vim backup_auditor.sh
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
cat backup_auditor.sh
#@ pause 5
./backup_auditor.sh
#! Now every path produces exactly one message, which is what the requirement asked for.
clear

#^ 6. Clean up
rm ~/scripts/backup_auditor.sh
y

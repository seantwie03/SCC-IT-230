kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Creating Users from a File
# Requirements
#   Host: servera
#   Script location: /home/student/scripts/user_creator.sh
#   Create an account for every name listed in new_users.txt
#   The script must be safe to run twice
#   Only a privileged user may run it
# Steps
#   1. Write the list of accounts to create into an input file
#   2. Create an executable script that reads the file line by line
#   3. Create each listed account and report whether it worked
#   4. Refuse to run unless the script was started with root privileges
#   5. Skip blank lines, then rerun the script to confirm it is safe to repeat
clear

#^ 1. Write the list of accounts to create into an input file
#! A stand-in for a list of new hires handed to you by HR
mkdir -p ~/scripts
cd ~/scripts
vim new_users.txt
ithufir_hawat
lady_jessica
#@ pause 5
#@ noenter
paul_atreides
#@ key escape
:wq
#@ pause 5
cat new_users.txt
clear

#^ 2. Create an executable script that reads the file line by line
vim user_creator.sh
#! Students' vim adds # after the hashbang; Enter, Backspace, Enter clears it
i#!/bin/bash
#@ noenter
echo "Starting $0"
#@ key escape
:wq
chmod a+x user_creator.sh
./user_creator.sh
vim user_creator.sh
/Starting \$0
#@ noenter
o
while read -r new_user; do
    echo "Processing: $new_user"
#@ pause 5
#@ noenter
done < "new_users.txt"
#@ key escape
:wq
./user_creator.sh
clear

#^ 3. Create each listed account and report whether it worked
vim user_creator.sh
/Processing:
#@ noenter
o
#@ pause 5
#@ noenter
    useradd "$new_user"
#@ key escape
:wq
#! useradd needs root
sudo ./user_creator.sh
#! Run it again: every useradd fails because the accounts already exist
sudo ./user_creator.sh
clear
#! useradd returns 0 on success; branch on that so the output tells the truth
vim user_creator.sh
/useradd "\$new_user"
#@ noenter
iif
#@ key space
#@ key escape
A; then
        echo "User created."
    else
        echo "User NOT created."
#@ pause 5
#@ noenter
    fi
#@ key escape
:wq
#@ pause 5
cat user_creator.sh
echo "feyd_rautha" >> new_users.txt
sudo ./user_creator.sh
clear

#^ 4. Refuse to run unless the script was started with root privileges
#! EUID is the effective user ID of the running process; root is always 0
echo $EUID
sudo bash -c 'echo $EUID'
clear
vim user_creator.sh
/Starting \$0
#@ noenter
O
if [[ $EUID -ne 0 ]]; then
    echo "You must be root to run this script!"
    exit 1
#@ pause 5
#@ noenter
fi
#@ key escape
:wq
#! Without sudo the script now stops before it changes anything
./user_creator.sh
echo $?
sudo ./user_creator.sh
clear

#^ 5. Skip blank lines, then rerun the script to confirm it is safe to repeat
#! A stray blank line at the end of an input file is very common
vim new_users.txt
#@ noenter
G
#@ pause 5
#@ noenter
o
#@ key escape
:wq
sudo ./user_creator.sh
vim user_creator.sh
/Processing:
#@ noenter
O
    if [[ -z "$new_user" ]]; then
        echo "Skipping empty line"
        continue
#@ pause 5
#@ noenter
    fi
#@ key escape
:wq
sudo ./user_creator.sh
clear

#^ Clean up
#! Remove the accounts and their home directories; nothing later uses them
sudo userdel -r thufir_hawat
sudo userdel -r lady_jessica
sudo userdel -r paul_atreides
sudo userdel -r feyd_rautha
\rm ~/scripts/user_creator.sh ~/scripts/new_users.txt

# Complete

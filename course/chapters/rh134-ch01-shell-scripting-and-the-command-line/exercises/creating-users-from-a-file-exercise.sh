kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Creating Users from a File
# Requirements
#   Host: servera
#   Script location: /home/student/scripts/user_creator.sh
#   Create an account for every name listed in new_users.txt
#   The script must be safe to run twice
#   Only a privileged user may run it
# Tasks
#   1. Stage the new_users.txt file
#   2. Create a basic script file and make it executable
#   3. Read the file line by line
#   4. Report whether each account was created
#   5. Refuse to run without root privileges
#   6. Skip blank lines
#   7. Clean up
clear

#^ 1. Stage the new_users.txt file
#! This stands in for a list of new hires handed to you by HR.
mkdir -p ~/scripts
cd ~/scripts
vim new_users.txt
ithufir_hawat
lady_jessica
paul_atreides
jj:wq
cat new_users.txt

#^ 2. Create a basic script file and make it executable
vim user_creator.sh
#! Press enter, backspace, enter after the next command.
i#!/bin/bash
echo "Starting $0"
jj:wq
chmod a+x user_creator.sh
sudo ./user_creator.sh
clear

#^ 3. Read the file line by line
vim user_creator.sh
/Starting \$0
o
while read -r new_user; do
    echo "Processing: $new_user"
    useradd "$new_user"
done < "new_users.txt"
jj:wq
sudo ./user_creator.sh
#! Now run it again. Every useradd fails because the accounts already exist.
sudo ./user_creator.sh
clear

#^ 4. Report whether each account was created
#! useradd returns 0 on success. Branch on that so the output tells the truth.
vim user_creator.sh
/useradd "\$new_user"
iif jjA; then
        echo "User created."
    else
        echo "User NOT created."
    fi
jj:wq
cat user_creator.sh
echo "feyd_rautha" >> new_users.txt
sudo ./user_creator.sh
clear

#^ 5. Refuse to run without root privileges
#! EUID is the effective user ID of the running process. Root is always 0.
echo $EUID
sudo bash -c 'echo $EUID'
clear
vim user_creator.sh
/bin\/bash
o
if [[ $EUID -ne 0 ]]; then
    echo "You must be root to run this script!"
    exit 9
fi
jj:wq
#! Without sudo the script now stops immediately instead of failing halfway.
./user_creator.sh
echo $?
sudo ./user_creator.sh
clear

#^ 6. Skip blank lines
#! A stray blank line at the end of the input file is very common.
vim new_users.txt
G
o
jj:wq
sudo ./user_creator.sh
vim user_creator.sh
/Processing:
O
    if [[ -z "$new_user" ]]; then
        echo "Skipping empty line"
        continue
    fi
jj:wq
sudo ./user_creator.sh
clear

#^ 7. Clean up
#! Remove the accounts and their home directories so the host returns to its starting state.
sudo userdel -r thufir_hawat
sudo userdel -r lady_jessica
sudo userdel -r paul_atreides
sudo userdel -r feyd_rautha
rm ~/scripts/user_creator.sh ~/scripts/new_users.txt
cd ~

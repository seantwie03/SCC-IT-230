kitten @ action --self change_font_size current 30 && ssh workstation
ssh servera
clear

#@ pause 8
#^ Exercise: Customizing the Prompt
# Requirements
#   Hosts: workstation, then servera
#   Change your prompt for one shell, then keep the change
# Steps
#   1. Read the current value of PS1
#   2. Change \W to \w to show the full working directory
#   3. Move into a deeply nested directory and judge the result
#   4. Confirm the change disappears in a new session
#   5. Persist the prompt you prefer in ~/.bashrc
clear

#^ 1. Read the current value of PS1
echo $PS1
#! Backslash sequences: \u is the user, \h the host
#! The default \W shows only the last segment of the path
clear

#^ 2. Change \W to \w to show the full working directory
cd /var/log
#! \W showed log; \w shows /var/log
PS1='\u@\h:\w\$ '
clear

#^ 3. Move into a deeply nested directory and judge the result
mkdir -p ~/app/backend/config/db_settings
#@ pause 5
cd ~/app/backend/config/db_settings
#! A full path is informative until it eats half the line
#! \W would show only db_settings; pick whichever you can live with
clear

#^ 4. Confirm the change disappears in a new session
#! Log out of servera and log back in
exit
ssh servera
echo $PS1
clear

#^ 5. Persist the prompt you prefer in ~/.bashrc
cd ~
vim ~/.bashrc
#@ noenter
Gzz
#@ noenter
o
#@ pause 5
#@ noenter
PS1='\u@\h:\w\$ '
#@ key escape
:wq
exit
ssh servera
echo $PS1
clear

#^ Clean up
#! Nothing later uses the practice directories
rm -rf ~/app

# Complete

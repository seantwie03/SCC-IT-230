kitten @ set-font-size 30.0 && ssh workstation
ssh servera
clear

#^ Exercise: Customizing the Prompt
# Requirements
#   Hosts: workstation, then servera
# Tasks
#   1. Read the current value of PS1
#   2. Change \W to \w to show the full working directory
#   3. Judge the result from a deeply nested directory
#   4. Confirm the change disappears in a new session
#   5. Persist the prompt you prefer in ~/.bashrc
clear

#^ 1. Read the current value of PS1
echo $PS1
#! Every character in there is an escape sequence. \u is the user, \h the host.
#! The default uses \W, which shows only the last segment of the path.
clear

#^ 2. Change \W to \w to show the full working directory
cd /var/log
#! \W showed log. \w shows /var/log.
PS1='\\u@\h:\w\$ '
clear

#^ 3. Judge the result from a deeply nested directory
mkdir -p ~/app/backend/config/db_settings
cd ~/app/backend/config/db_settings
#! A full path is informative until it eats half the line.
#! Going back to \W would show only db_settings. Pick whichever you can live with.
clear

#^ 4. Confirm the change disappears in a new session
#! Log out of servera and log back in.
exit
ssh servera
echo $PS1
clear

#^ 5. Persist the prompt you prefer in ~/.bashrc
cd ~
vim ~/.bashrc
Gzz
o
PS1='\\u@\h:\w\$ '
jj:wq
exit
ssh servera
echo $PS1
clear

#^ Clean up
rm -rf ~/app

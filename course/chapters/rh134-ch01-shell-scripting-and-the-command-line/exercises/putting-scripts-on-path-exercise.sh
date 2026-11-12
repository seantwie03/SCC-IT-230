kitten @ action --self change_font_size current 30 && ssh workstation
ssh servera
clear

#@ pause 8
#^ Exercise: Putting Scripts on the PATH
# Requirements
#   Hosts: workstation, then servera
#   Give yourself a scripts directory that every new session can find
# Steps
#   1. Inspect the current PATH and find where it is already set in ~/.bashrc
#   2. Create a scripts directory and append it to PATH for this shell only
#   3. Confirm it disappears in a new session
#   4. Add the same line to ~/.bashrc
#   5. Confirm a new session now finds the directory
clear

#^ 1. Inspect the current PATH and find where it is already set in ~/.bashrc
echo $PATH
#! Colon-separated directories, searched left to right; the first match wins
#! Red Hat already customizes PATH in ~/.bashrc; you are about to do the same
less ~/.bashrc
#@ pause 6
/PATH
#@ noenter
q
clear

#^ 2. Create a scripts directory and append it to PATH for this shell only
mkdir -p ~/scripts
PATH=$PATH:~/scripts
echo $PATH
#! $PATH on the right keeps everything already there
clear

#^ 3. Confirm it disappears in a new session
#! Log out of servera and log back in; nothing wrote the change to a file
exit
ssh servera
echo $PATH
clear

#^ 4. Add the same line to ~/.bashrc
vim ~/.bashrc
#@ noenter
Gzz
#@ noenter
o
#@ pause 5
#@ noenter
PATH=$PATH:~/scripts
#@ key escape
:wq
clear

#^ 5. Confirm a new session now finds the directory
exit
ssh servera
echo $PATH

# Complete

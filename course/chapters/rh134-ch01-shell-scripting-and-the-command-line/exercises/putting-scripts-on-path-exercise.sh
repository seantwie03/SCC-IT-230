kitten @ set-font-size 30.0 && ssh workstation
ssh servera
clear

#^ Exercise: Putting Scripts on the PATH
# Requirements
#   Hosts: workstation, then servera
# Tasks
#   1. Inspect the current PATH
#   2. Find where PATH is already set in ~/.bashrc
#   3. Create ~/scripts and add it to PATH for this shell only
#   4. Confirm it disappears in a new shell
#   5. Persist it in ~/.bashrc
clear

#^ 1. Inspect the current PATH
echo $PATH
#! Directories separated by colons, searched left to right. The first match wins.
clear

#^ 2. Find where PATH is already set in ~/.bashrc
#! Red Hat already customizes PATH here. You are about to do the same thing.
less ~/.bashrc
/PATH
q
clear

#^ 3. Create ~/scripts and add it to PATH for this shell only
mkdir -p ~/scripts
PATH=$PATH:~/scripts
echo $PATH
#! $PATH on the right keeps everything that was already there.
clear

#^ 4. Confirm it disappears in a new session
#! Log out of servera and log back in. Nothing wrote it to a file.
exit
ssh servera
echo $PATH
clear

#^ 5. Persist it in ~/.bashrc
vim ~/.bashrc
Gzz
o
PATH=$PATH:~/scripts
jj:wq
exit
ssh servera
echo $PATH
clear

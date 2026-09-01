kitten @ set-font-size 30.0 && ssh workstation
ssh servera
clear

#^ Exercise: Aliasing Away Typos
# Requirements
#   Hosts: workstation, then servera
# Tasks
#   1. List the aliases the shell already defines
#   2. Alias a typo you make often
#   3. Bypass the alias once
#   4. Confirm the alias is gone in a new shell
#   5. Put it in ~/.bashrc.d/aliases
clear

#^ 1. List the aliases the shell already defines
alias
#! RHEL predefines only a handful, mostly --color wrappers around grep.
clear

#^ 2. Alias a typo you make often
cd /etc
sl
alias sl='ls'
sl
clear

#^ 3. Bypass the alias once
cd ~
alias rm='rm -i'
touch scratch_file.txt
#! rm now asks first. Answer n to keep the file.
rm scratch_file.txt
#! A backslash runs the real command, with no prompt.
\rm scratch_file.txt
ls scratch_file.txt
clear

#^ 4. Confirm the alias is gone in a new session
#! Log out of servera and log back in.
exit
ssh servera
alias
sl
clear

#^ 5. Put it in ~/.bashrc.d/aliases
#! ~/.bashrc.d does not exist yet. The loop at the bottom of ~/.bashrc loads
#! anything you put in it, so you never touch ~/.bashrc itself.
mkdir -p ~/.bashrc.d
vim ~/.bashrc.d/aliases
i
alias sl='ls'
alias rm='rm -i'
jj:wq
exit
ssh servera
alias
sl
clear

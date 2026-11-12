kitten @ action --self change_font_size current 30 && ssh workstation
ssh servera
clear

#@ pause 8
#^ Exercise: Aliasing Away Typos
# Requirements
#   Hosts: workstation, then servera
#   Turn a typo you keep making into a working command, in every shell from now on
# Steps
#   1. List the aliases the shell already defines
#   2. Define an alias for a typo you make often and confirm it expands
#   3. Bypass the alias once without removing it
#   4. Confirm the alias is gone in a new session
#   5. Put it in ~/.bashrc.d/aliases and confirm a new session loads it
clear

#^ 1. List the aliases the shell already defines
#@ pause 5
alias
#! RHEL predefines only a handful, mostly --color wrappers around grep and ls
clear

#^ 2. Define an alias for a typo you make often and confirm it expands
cd /etc
sl
alias sl='ls'
sl
clear

#^ 3. Bypass the alias once without removing it
cd ~
alias rm='rm -i'
touch scratch_file.txt
#! rm now asks first; answer n to keep the file
rm scratch_file.txt
#@ key n
#@ key enter
#! A backslash runs the real command, with no prompt
\rm scratch_file.txt
ls scratch_file.txt
clear

#^ 4. Confirm the alias is gone in a new session
#! Log out of servera and log back in
exit
ssh servera
#@ pause 5
alias
sl
clear

#^ 5. Put it in ~/.bashrc.d/aliases and confirm a new session loads it
#! ~/.bashrc.d does not exist yet; the loop at the bottom of ~/.bashrc loads anything in it
mkdir -p ~/.bashrc.d
vim ~/.bashrc.d/aliases
#@ noenter
i
alias sl='ls'
#@ pause 5
#@ noenter
alias rm='rm -i'
#@ key escape
:wq
exit
ssh servera
#@ pause 5
alias
sl

# Complete

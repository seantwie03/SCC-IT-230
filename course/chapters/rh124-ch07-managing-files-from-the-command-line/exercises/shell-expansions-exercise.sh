kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Match Files with Glob Patterns in /etc/ssh
# Requirements
#   Host: servera
# Tasks
#   1. Match file names with an asterisk (*)
#   2. Match single characters with a question mark (?)
#   3. Match character sets with brackets ([...])
#   4. Observe pathname expansion directly with echo
clear

#^ 1. Match file names with an asterisk (*)
cd /etc/ssh
ls
ls *.pub
ls *config
clear

#^ 2. Match single characters with a question mark (?)
ls
ls ssh?_config
ls ssh_host_???_key.pub

#^ 3. Match character sets with brackets ([...])
ls ssh_host_[e]*.pub
ls ssh_host_[r]*.pub
ls ssh_host_[re]*.pub
ls *[0-9]*
clear

#^ 4. Observe pathname expansion directly with echo
echo *
echo *.pub

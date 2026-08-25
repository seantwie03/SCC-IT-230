kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Search the SSH Log with grep
# Requirements
#   Host: servera
# Tasks
#   1. Find matching log entries
#   2. Show context around matches
#   3. Refine results with grep options
clear

#^ 1. Find matching log entries
sudo grep 'sshd' /var/log/secure
sudo grep 'Accepted' /var/log/secure
clear

#^ 2. Show context around matches
systemctl status sshd | grep -B2 -A3 'Active:'
clear

#^ 3. Refine results with grep options
ps ax | grep 'sshd'
ps ax | grep 'sshd' | grep -v 'grep'
sudo sshd -T | grep -e '^port ' -e '^permitrootlogin '
sudo grep 'accepted' /var/log/secure
sudo grep -i 'accepted' /var/log/secure

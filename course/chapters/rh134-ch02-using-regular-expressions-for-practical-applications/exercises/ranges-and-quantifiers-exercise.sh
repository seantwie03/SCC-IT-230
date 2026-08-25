kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Apply Ranges and Quantifiers to Logs and Paths
# Requirements
#   Host: servera
#   Privileges: sudo access to write and read authentication log entries
# Tasks
#   1. Seed and verify failed-login entries
#   2. Extract and count the IP addresses
#   3. Create and match a sample directory tree
#   4. Clean up
clear

#^ 1. Seed and verify failed-login entries
sudo -i

#! logger writes to the system log. Two of these repeat the same address on purpose.
logger -p authpriv.info -t sshd "Failed password for root from 1.3.3.7"
logger -p authpriv.info -t sshd "Failed password for root from 1.3.3.7"
logger -p authpriv.info -t sshd "Failed password for student from 10.31.31.11"
logger -p authpriv.info -t sshd "Failed password for student from 203.230.113.245"
logger -p authpriv.info -t sshd "Failed password for student from 203.230.113.245"

tail -n 5 /var/log/secure
clear

#^ 2. Extract and count the IP addresses
#! -o prints just the matched text. -E turns on the extended dialect so {1,3} works unescaped.
grep 'Failed password' /var/log/secure | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}'
grep 'Failed password' /var/log/secure | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | uniq -c
exit
clear

#^ 3. Create and match a sample directory tree
mkdir -p /tmp/demo_paths/website/css
touch /tmp/demo_paths/website/css/style.css
touch /tmp/demo_paths/website/index.html
sudo find /tmp
#! This is the same pattern SELinux uses to label a directory tree.
sudo find /tmp | grep -E '/website(/.*)?'
clear

#^ 4. Clean up
rm -rf /tmp/demo_paths
ls /tmp

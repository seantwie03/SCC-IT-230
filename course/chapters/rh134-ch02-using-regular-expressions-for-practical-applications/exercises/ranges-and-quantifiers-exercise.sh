kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task 1: Extract IP Addresses From the Authentication Log
sudo -i

#^ Seed a few failed-login entries
#! logger writes to the system log. Two of these repeat the same address on purpose.
logger -p authpriv.info -t sshd "Failed password for root from 1.3.3.7"
logger -p authpriv.info -t sshd "Failed password for root from 1.3.3.7"
logger -p authpriv.info -t sshd "Failed password for student from 10.31.31.11"
logger -p authpriv.info -t sshd "Failed password for student from 203.230.113.245"
logger -p authpriv.info -t sshd "Failed password for student from 203.230.113.245"
tail -n 5 /var/log/secure
clear

#^ Pull only the addresses out of the matching lines
#! -o prints just the matched text. -E turns on the extended dialect so {1,3} works unescaped.
grep 'Failed password' /var/log/secure | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}'
clear

#^ Count how often each address appears
grep 'Failed password' /var/log/secure | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | uniq -c
exit
clear

#^ Task 2: Match a Directory and Everything Inside It
mkdir -p /tmp/demo_paths/website/css
touch /tmp/demo_paths/website/css/style.css
touch /tmp/demo_paths/website/index.html
sudo find /tmp
clear

#^ Keep only the website directory and its contents
#! This is the same pattern SELinux uses to label a directory tree.
sudo find /tmp | grep -E '/website(/.*)?'
clear

#^ Clean up
rm -rf /tmp/demo_paths
ls /tmp
clear

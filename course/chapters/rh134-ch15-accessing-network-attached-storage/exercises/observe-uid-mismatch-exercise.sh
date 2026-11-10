kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 10
#^ Exercise: Observe a UID Mismatch
# Requirements
#   Hosts: servera (server), workstation (client)
#   Prerequisite exercise: UID-Based Access Control
#   Break one user's UID on workstation and watch servera apply someone else's permissions
# Steps
#   1. On workstation, give con_john the UID dev_jane has on servera
#   2. Without remounting, access the share as con_john
#   3. Note which files you can reach, and whose permissions apply
#   4. Restore con_john's UID and verify his access is back to normal
clear

#^ 1. On workstation, give con_john the UID dev_jane has on servera
sudo -i
id con_john
id dev_jane
#! -o allows a UID that another account already has
usermod -o -u 1101 con_john
id con_john
clear

#^ 2. Without remounting, access the share as con_john
#! No account on workstation has UID 1100 now, so ls shows the bare number
#@ pause 6
ls -l /nfs/teams
su - con_john
id
clear

#^ 3. Note which files you can reach, and whose permissions apply
#! servera sees UID 1101, which is dev_jane, so dev_jane's notes open
cat /nfs/teams/developers/notes.txt
#! The consultants directory still opens through con_john's group, GID 1200
cat /nfs/teams/consultants/report.txt
exit
clear

#^ 4. Restore con_john's UID and verify his access is back to normal
usermod -u 1100 con_john
id con_john
su - con_john
cat /nfs/teams/consultants/report.txt
#! Permission denied again: servera sees UID 1100
cat /nfs/teams/developers/notes.txt
exit
clear

#^ Clean up
#! The users stay for the next exercise; the teams share goes
umount /nfs/teams
rmdir /nfs/teams
exit
exit
ssh servera
sudo -i
vim /etc/exports
#@ pause 3
#@ noenter
dd
:wq
exportfs -r
#! root's rm is an alias for rm -i, which asks before each delete; -f skips the questions
rm -rf /srv/teams

# Complete

kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 18
#^ Exercise: Backing Up /etc Nightly
# Requirements
#   Hosts: servera, with workstation holding the offsite copy
#   Back up /etc every night at 10 p.m., as root
#   Copy each snapshot to workstation as an offsite copy
#   servera is always on, so a system crontab is the right home
# Tasks
#   1. Write the backup script on servera
#   2. Schedule it in /etc/cron.d
#   3. Find out why nothing happened
#   4. Confirm root ran it, then set the real 10 p.m. schedule
#   5. Clean up the schedule, script, and offsite copies
clear

#^ 1. Write the backup script on servera
sudo -i
vim /usr/local/bin/etc_backup.sh
i#!/bin/bash
backup_host="workstation"
#@ pause 5
#@ noenter
scp -r /etc "student@${backup_host}:/tmp/$(hostname)_etc_$(date --iso-8601=minutes)"
#@ key escape
:wq
chmod a+x /usr/local/bin/etc_backup.sh
#! Run it by hand before trusting it to a schedule
#@ pause 10
/usr/local/bin/etc_backup.sh
#@ pause 5
ssh student@workstation 'ls -ld /tmp/servera.lab.example.com_etc_*'
#@ pause 5
ssh student@workstation 'ls -l /tmp/servera.lab.example.com_etc_*/passwd'
clear

#^ 2. Schedule it in /etc/cron.d
#! Copying /etc/crontab gives you the field reference as a starting point
cp /etc/crontab /etc/cron.d/backups
vim /etc/cron.d/backups
#@ pause 5
#@ noenter
Go* * * * * root etc_backup.sh
#@ key escape
:wq
#@ pause 5
tail -1 /etc/cron.d/backups
clear

#@ pause 70
#^ 3. Find out why nothing happened
#! Wait for the next minute, then look for a new snapshot
#@ pause 5
ssh student@workstation 'ls -ld /tmp/servera.lab.example.com_etc_*'
#@ pause 5
grep etc_backup /var/log/cron
#! command not found. Cron's PATH does not include /usr/local/bin.
vim /etc/cron.d/backups
#@ pause 5
#@ noenter
GC* * * * * root /usr/local/bin/etc_backup.sh
#@ key escape
:wq
clear

#@ pause 70
#^ 4. Confirm root ran it, then set the real 10 p.m. schedule
#! Wait for the next minute again
#@ pause 5
grep etc_backup /var/log/cron
#@ pause 5
ssh student@workstation 'ls -ld /tmp/servera.lab.example.com_etc_*'
#@ pause 5
ssh student@workstation 'ls -l /tmp/servera.lab.example.com_etc_*/passwd'
vim /etc/cron.d/backups
#@ pause 5
#@ noenter
GC0 22 * * * root /usr/local/bin/etc_backup.sh
#@ key escape
:wq
#@ pause 5
tail -1 /etc/cron.d/backups
clear

#^ 5. Clean up
#! Still in the root shell on servera, so no sudo and no exits to unwind
rm -f /etc/cron.d/backups /usr/local/bin/etc_backup.sh
ssh student@workstation 'sudo rm -rf /tmp/servera.lab.example.com_etc_*'
ls /etc/cron.d/
exit

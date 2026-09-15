kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 18
#^ Exercise: Backing Up /etc/passwd Nightly
# Requirements
#   Hosts: servera, then workstation standing in for a laptop
#   Back up /etc/passwd every night at 10 p.m., as root
#   Copy each snapshot to workstation as an offsite copy
#   servera is always on, so a system crontab is the right home
#   workstation is a laptop, so the same script goes to anacron instead
# Tasks
#   1. Write the backup script on servera
#   2. Schedule it in /etc/cron.d
#   3. Find out why nothing happened
#   4. Confirm root ran it, then set the real 10 p.m. schedule
#   5. Give the same script to anacron on workstation
#   6. Let anacron catch up, then clean up both hosts
clear

#^ 1. Write the backup script on servera
sudo -i
vim /usr/local/bin/etc_backup.sh
i#!/bin/bash
backup_host="workstation"
scp -r /etc "student@${backup_host}:/tmp/$(hostname)_etc_$(date --iso-8601=minutes)"
#@ key ESC
:wq
chmod a+x /usr/local/bin/etc_backup.sh
#! Run it by hand before trusting it to a schedule
/usr/local/bin/etc_backup.sh
ls -l /tmp/passwd_*
ssh workstation 'ls -l /tmp/passwd_*'
clear

#^ 2. Schedule it in /etc/cron.d
#! Copying /etc/crontab gives you the field reference as a starting point
cp /etc/crontab /etc/cron.d/backups
vim /etc/cron.d/backups
Go* * * * * root etc_backup.sh
jj:wq
tail -1 /etc/cron.d/backups
clear

#@ pause 70
#^ 3. Find out why nothing happened
#! Wait for the next minute, then look for a new snapshot
ls -l /tmp/passwd_*
grep etc_backup /var/log/cron
#! command not found. Cron's PATH does not include /usr/local/bin.
vim /etc/cron.d/backups
GC* * * * * root /usr/local/bin/etc_backup.sh
jj:wq
clear

#@ pause 70
#^ 4. Confirm root ran it, then set the real 10 p.m. schedule
#! Wait for the next minute again
grep etc_backup /var/log/cron
ls -l /tmp/passwd_*
ssh workstation 'ls -l /tmp/passwd_*'
vim /etc/cron.d/backups
GC0 22 * * * root /usr/local/bin/etc_backup.sh
jj:wq
tail -1 /etc/cron.d/backups
clear

#^ 5. Clean up
#! Still in the root shell on servera, so no sudo and no exits to unwind
rm -f /etc/cron.d/backups /usr/local/bin/etc_backup.sh /tmp/passwd_*
ls /etc/cron.d/
exit

kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Backing Up /etc Nightly
# Requirements
#   Hosts: servera, then workstation standing in for a laptop
#   Back up /etc every night at 10 p.m., as root
#   Copy each archive to workstation as an offsite snapshot
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
BACKUP_HOST="workstation"
ARCHIVE="/tmp/etc_$(date --iso-8601=minutes).tar.gz"

tar -caf "${ARCHIVE}" /etc 2>/dev/null
scp -q "${ARCHIVE}" "${BACKUP_HOST}:/tmp/"
jj:wq
chmod a+x /usr/local/bin/etc_backup.sh
#! Run it by hand before trusting it to a schedule
/usr/local/bin/etc_backup.sh
ls -l /tmp/etc_*.tar.gz
ssh workstation 'ls -l /tmp/etc_*.tar.gz'
clear

#^ 2. Schedule it in /etc/cron.d
#! Copying /etc/crontab gives you the field reference as a starting point
cp /etc/crontab /etc/cron.d/backups
vim /etc/cron.d/backups
Go* * * * * root etc_backup.sh
jj:wq
tail -1 /etc/cron.d/backups
clear

#^ 3. Find out why nothing happened
#! Wait for the next minute, then look for a new archive
ls -l /tmp/etc_*.tar.gz
grep etc_backup /var/log/cron
#! command not found. Cron's PATH does not include /usr/local/bin.
vim /etc/cron.d/backups
Gcc* * * * * root /usr/local/bin/etc_backup.sh
jj:wq
clear

#^ 4. Confirm root ran it, then set the real 10 p.m. schedule
#! Wait for the next minute again
grep etc_backup /var/log/cron
ls -l /tmp/etc_*.tar.gz
ssh workstation 'ls -l /tmp/etc_*.tar.gz'
vim /etc/cron.d/backups
Gcc0 22 * * * root /usr/local/bin/etc_backup.sh
jj:wq
tail -1 /etc/cron.d/backups
clear

#^ 5. Give the same script to anacron on workstation
#! workstation is our pretend laptop: asleep at 10 p.m., so cron would never fire
exit
ssh workstation
sudo -i
vim /etc/cron.daily/etc_backup.sh
i#!/bin/bash
ARCHIVE="/tmp/etc_$(date --iso-8601=minutes).tar.gz"

tar -caf "${ARCHIVE}" /etc 2>/dev/null
jj:wq
chmod a+x /etc/cron.daily/etc_backup.sh
clear

#^ 6. Let anacron catch up, then clean up both hosts
cat /var/spool/anacron/cron.daily
#! anacron does nothing while the job is up to date
anacron -n
ls /tmp/etc_*.tar.gz
#! Now pretend the laptop has been closed since January
echo 20260101 > /var/spool/anacron/cron.daily
anacron -n
ls -l /tmp/etc_*.tar.gz
cat /var/spool/anacron/cron.daily
rm -f /etc/cron.daily/etc_backup.sh /tmp/etc_*.tar.gz
exit
exit
#! Those two exits drop the root shell and the ssh session, landing back on servera
sudo rm -f /etc/cron.d/backups /usr/local/bin/etc_backup.sh /tmp/etc_*.tar.gz
ls /etc/cron.d/

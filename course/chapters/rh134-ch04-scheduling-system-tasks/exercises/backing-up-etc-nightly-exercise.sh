kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Backing Up /etc Nightly
# Requirements
#   Hosts: servera, then workstation standing in for a laptop
#   Back up /etc every night at 10 p.m., as root
#   servera is always on, so a system crontab is the right home
#   workstation is a laptop, so the same script goes to anacron instead
# Tasks
#   1. Write the backup script on servera
#   2. Schedule it in /etc/cron.d
#   3. Confirm root ran it
#   4. Set the real 10 p.m. schedule
#   5. Give the same script to anacron on workstation
#   6. Let anacron catch up, then clean up both hosts
clear

#^ 1. Write the backup script on servera
sudo -i
vim /usr/bin/etc_backup.sh
i#!/bin/bash
tar -caf /tmp/etc_$(date --iso-8601=minutes).tar.gz /etc 2>/dev/null
jj:wq
chmod a+x /usr/bin/etc_backup.sh
#! Run it once by hand before trusting it to a schedule
etc_backup.sh
ls -l /tmp/etc_*.tar.gz
clear

#^ 2. Schedule it in /etc/cron.d
#! Copying /etc/crontab gives you the field reference as a starting point
cp /etc/crontab /etc/cron.d/backups
vim /etc/cron.d/backups
Go* * * * * root /usr/bin/etc_backup.sh
jj:wq
tail -1 /etc/cron.d/backups
clear

#^ 3. Confirm root ran it
#! Wait for the next minute to tick over
grep etc_backup /var/log/cron
ls -l /tmp/etc_*.tar.gz
clear

#^ 4. Set the real 10 p.m. schedule
vim /etc/cron.d/backups
Gcc0 22 * * * root /usr/bin/etc_backup.sh
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
tar -caf /tmp/etc_$(date --iso-8601=minutes).tar.gz /etc 2>/dev/null
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
sudo rm -f /etc/cron.d/backups /usr/bin/etc_backup.sh /tmp/etc_*.tar.gz
ls /etc/cron.d/

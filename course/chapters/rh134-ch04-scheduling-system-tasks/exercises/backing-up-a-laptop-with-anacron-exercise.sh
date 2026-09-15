kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 18
#^ Exercise: Backing Up a Laptop with Anacron
# Requirements
#   Host: workstation, standing in for a laptop
#   Back up the /etc about once a day, as root
#   The machine is closed at night, so a crontab entry would never fire
#   Anacron runs an overdue job once the machine is back
# Tasks
#   1. Write the daily backup script
#   2. Ask anacron to run what is due
#   3. Pretend the laptop has been closed since January
#   4. Confirm the backup ran, then clean up
clear

#^ 1. Write the daily backup script
sudo -i
vim /etc/cron.daily/etc_backup.sh
i#!/bin/bash
backup_host='workstation'
scp -r /etc student@"${backup_host}":/tmp/$(hostname)_etc_backup_$(date --iso-8601=minutes)
#@ key escape
:wq
#! There is no schedule to write. The directory is the schedule.
chmod a+x /etc/cron.daily/etc_backup.sh
ls -l /etc/cron.daily/etc_backup.sh
clear

#^ 2. Ask anacron to run what is due
cat /var/spool/anacron/cron.daily
anacron -n
ls /tmp/workstation_etc*
#! Nothing ran, because today's daily jobs are not overdue
clear

#^ 3. Pretend the laptop has been closed since January
echo 20260101 > /var/spool/anacron/cron.daily
#! anacron returns before the job finishes, so give it a moment
#@ pause 2
anacron -n
clear

#^ 4. Confirm the backup ran, then clean up
ls -l /tmp/workstation_etc*
cat /var/spool/anacron/cron.daily
#! The recorded date caught up to today, so the job is no longer overdue
rm -f /etc/cron.daily/etc_backup.sh /tmp/passwd_*
exit

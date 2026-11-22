kitten @ action --self change_font_size current 30 && ssh serverb
clear

#@ pause 10
#^ Exercise: Operate Forgejo
# Requirements
#   Hosts: serverb, servera
#   Prerequisite exercise: Build the Web Tier
#   Back up Forgejo's database and files to servera every night, and read the web tier's log
# Steps
#   1. Install rsync on serverb and servera
#   2. Write a script that backs up the database and files, keeps the seven newest, and copies them to servera
#   3. Run it by hand under nice, and check the copy on servera
#   4. Schedule it nightly in /etc/cron.d
#   5. Rotate the backup's log with logrotate
#   6. Search servera's access log for errors
clear

#^ 1. Install rsync on serverb and servera
sudo -i
#! rsync must be installed at both ends of the copy
#@ pause 6
dnf install -y rsync
#! root reaches every lab host with a key, so no password is asked
#@ pause 6
ssh servera dnf install -y rsync
clear

#^ 2. Write a script that backs up the database and files, keeps the seven newest, and copies them to servera
#! Each run gets a dated directory with the dump and the files, so keeping seven keeps seven complete backups
#! mkdir -p also creates /var/backups/forgejo on the first run
#! The search index is left out: Forgejo can rebuild it, and it is busy while Forgejo runs
vim /usr/local/bin/forgejo_backup.sh
i#!/bin/bash
backup_dir="/var/backups/forgejo"
run_dir="${backup_dir}/forgejo_$(date --iso-8601=minutes)"
mkdir -p "${run_dir}"
su - postgres -c "pg_dump forgejo" | gzip > "${run_dir}/database.sql.gz"
tar -C /srv -czf "${run_dir}/files.tar.gz" --exclude=forgejo/indexers forgejo
for old_run in $(ls -dt ${backup_dir}/forgejo_* | tail -n +8); do
    rm -r "${old_run}"
done
rsync -av --delete "${backup_dir}/" servera:forgejo-backups/
#@ pause 8
#@ noenter
echo "$(date) wrote ${run_dir}"
#@ key escape
:wq
chmod a+x /usr/local/bin/forgejo_backup.sh
clear

#^ 3. Run it by hand under nice, and check the copy on servera
#! Run it by hand before trusting it to a schedule
nice -n 10 /usr/local/bin/forgejo_backup.sh >> /var/log/forgejo_backup.log 2>&1
#@ pause 5
cat /var/log/forgejo_backup.log
#! rsync made forgejo-backups in root's home directory on servera, with one directory per run
#@ pause 5
ssh servera ls -lR forgejo-backups
clear

#^ 4. Schedule it nightly in /etc/cron.d
#! Copying /etc/crontab gives you the field reference as a starting point
cp /etc/crontab /etc/cron.d/forgejo_backup
vim /etc/cron.d/forgejo_backup
#@ pause 5
#@ noenter
Go0 2 * * * root nice -n 10 /usr/local/bin/forgejo_backup.sh >> /var/log/forgejo_backup.log 2>&1
#@ key escape
:wq
tail -1 /etc/cron.d/forgejo_backup
clear

#^ 5. Rotate the backup's log with logrotate
vim /etc/logrotate.d/forgejo_backup
i/var/log/forgejo_backup.log {
    weekly
    rotate 4
    compress
    missingok
#@ pause 5
#@ noenter
}
#@ key escape
:wq
#! --force rotates now instead of waiting for logrotate.timer
logrotate --force /etc/logrotate.d/forgejo_backup
ls /var/log/forgejo_backup*
clear

#^ 6. Search servera's access log for errors
exit
ssh servera
#! The 503 from the web tier exercise, before httpd was allowed to reach Forgejo
sudo grep -E '" 5[0-9]{2} ' /var/log/httpd/access_log
#! Every request, counted by status code
#@ pause 5
sudo grep -oE '" [0-9]{3} ' /var/log/httpd/access_log | sort | uniq -c

# Complete

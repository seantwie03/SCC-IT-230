kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Backing Up Documents Nightly
# Requirements
#   Host: servera
#   Back up /home/student/Documents every night at 2 a.m.
#   Each run writes to its own timestamped directory under /tmp
# Tasks
#   1. Create something worth backing up
#   2. Build and test the backup command
#   3. Schedule it one minute from now
#   4. Confirm it ran
#   5. Set the real schedule
#   6. Clean up
clear

#^ 1. Create something worth backing up
sudo dnf install -y rsync
mkdir -p ~/Documents/notes
echo "Kernel panic on servera, 03:14" > ~/Documents/incident_report.txt
echo "Check disk usage weekly" > ~/Documents/notes/reminders.txt
ls -R ~/Documents
clear

#^ 2. Build and test the backup command
date --iso-8601=minutes
rsync -a ~/Documents/ /tmp/documents_$(date --iso-8601=minutes)/
ls -d /tmp/documents_*
clear

#^ 3. Schedule it one minute from now
#! Every minute is a test schedule. The real one comes in step 5.
crontab -e
i* * * * * rsync -a /home/student/Documents/ /tmp/documents_$(date --iso-8601=minutes)/
jj:wq
crontab -l
#! A literal % in a crontab command means newline, so date +%F would need escaping. --iso-8601 avoids it.
clear

#^ 4. Confirm it ran
#! Wait for the next minute to tick over before continuing
sudo less /var/log/cron
G
q
ls -d /tmp/documents_*
clear

#^ 5. Set the real schedule
crontab -e
cc0 2 * * * rsync -a /home/student/Documents/ /tmp/documents_$(date --iso-8601=minutes)/
jj:wq
crontab -l
clear

#^ 6. Clean up
#! crontab -r prints a harmless mkdir warning about ~/.cache
crontab -r
crontab -l
rm -rf /tmp/documents_* ~/Documents

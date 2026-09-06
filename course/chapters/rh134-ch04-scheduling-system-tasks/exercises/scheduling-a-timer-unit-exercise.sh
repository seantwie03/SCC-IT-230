kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Scheduling a Timer Unit
# Requirements
#   Host: servera
#   Prerequisite: A Service That Checks Before It Runs
#   Run etc-sync.service on a schedule instead of by hand
#   The schedule must survive the machine being switched off
# Tasks
#   1. Confirm the service still works
#   2. Write a timer for it
#   3. Enable the timer, not the service
#   4. Watch it fire
#   5. Make it survive downtime
#   6. Clean up
clear

#^ 1. Confirm the service still works
sudo -i
systemctl start etc-sync.service
systemctl is-failed etc-sync.service
clear

#^ 2. Write a timer for it
#! The timer takes the service's name, with a .timer suffix
vim /etc/systemd/system/etc-sync.timer
i[Unit]
Description=Sync /etc to workstation on a schedule

[Timer]
OnCalendar=*:0/2

[Install]
WantedBy=timers.target
jj:wq
systemctl daemon-reload
clear

#^ 3. Enable the timer, not the service
systemctl enable --now etc-sync.timer
systemctl list-timers etc-sync.timer --no-pager
clear

#^ 4. Watch it fire
#! Wait for the next even minute
systemctl list-timers etc-sync.timer --no-pager
journalctl -u etc-sync.service -n 5 --no-pager
clear

#^ 5. Make it survive downtime
ls -l /var/lib/systemd/timers/
#! No stamp file yet, because nothing is recording the last run
vim /etc/systemd/system/etc-sync.timer
/OnCalendar
ccOnCalendar=daily
oPersistent=true
jj:wq
systemctl daemon-reload
systemctl restart etc-sync.timer
ls -l /var/lib/systemd/timers/
#! Now pretend the machine was switched off for three days
journalctl -u etc-sync.service --no-pager | grep -c Finished
touch -d "3 days ago" /var/lib/systemd/timers/stamp-etc-sync.timer
systemctl restart etc-sync.timer
journalctl -u etc-sync.service --no-pager | grep -c Finished
#! The count went up. The overdue run happened as soon as the timer came back.
clear

#^ 6. Clean up
systemctl disable --now etc-sync.timer
rm -f /etc/systemd/system/etc-sync.timer /etc/systemd/system/etc-sync.service
rm -f /usr/local/bin/etc_sync.sh /var/lib/systemd/timers/stamp-etc-sync.timer
systemctl daemon-reload
ssh workstation 'rm -rf /tmp/etc_from_servera'
dnf remove -y rsync

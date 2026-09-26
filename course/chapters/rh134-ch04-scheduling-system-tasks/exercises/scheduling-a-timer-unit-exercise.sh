kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 17
#^ Exercise: Scheduling a Timer Unit
# Requirements
#   Host: servera
#   Prerequisite: A Robust Sync Service
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
#@ pause 10
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
#@ pause 5
#@ noenter
WantedBy=timers.target
#@ key escape
:wq
systemctl daemon-reload
clear

#^ 3. Enable the timer, not the service
systemctl enable --now etc-sync.timer
#@ pause 5
systemctl list-timers etc-sync.timer --no-pager
clear

#@ pause 130
#^ 4. Watch it fire
#! Wait for the next even minute
#@ pause 5
systemctl list-timers etc-sync.timer --no-pager
#@ pause 5
journalctl -u etc-sync.service -n 5 --no-pager
clear

#^ 5. Make it survive downtime
#@ pause 5
ls -l /var/lib/systemd/timers/
#! No stamp file yet, because nothing is recording the last run
vim /etc/systemd/system/etc-sync.timer
/OnCalendar
#@ pause 5
#@ noenter
COnCalendar=daily
#@ key escape
#@ pause 5
#@ noenter
oPersistent=true
#@ key escape
:wq
systemctl daemon-reload
systemctl restart etc-sync.timer
#@ pause 5
ls -l /var/lib/systemd/timers/
#! Now pretend the machine was switched off for three days
journalctl -u etc-sync.service --no-pager | grep -c Finished
touch -d "3 days ago" /var/lib/systemd/timers/stamp-etc-sync.timer
#@ pause 10
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
#@ pause 10
dnf remove -y rsync

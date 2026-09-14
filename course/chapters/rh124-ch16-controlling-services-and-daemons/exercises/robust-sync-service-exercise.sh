kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 14
#^ Exercise: A Robust Sync Service
# Requirements
#   Hosts: servera and workstation
#   Sync /etc from servera to workstation
#   A run that cannot reach workstation must show as failed
# Tasks
#   1. Write the sync script
#   2. Write a service unit for it
#   3. Start it and read the journal
#   4. Break the check and watch the unit fail
#   5. Restore the check
clear

#^ 1. Write the sync script
sudo -i
dnf install -y rsync
clear
vim /usr/local/bin/etc_sync.sh
i#!/bin/bash
TARGET_HOST="workstation"
TARGET_DIR="/tmp/etc_from_servera"
rsync -a --delete /etc/ "${TARGET_HOST}:${TARGET_DIR}/"
jj:wq
chmod a+x /usr/local/bin/etc_sync.sh
#! Always run a script by hand before handing it to systemd
/usr/local/bin/etc_sync.sh
ssh workstation 'ls /tmp/etc_from_servera | head -3'
clear

#^ 2. Write a service unit for it
vim /etc/systemd/system/etc-sync.service
i[Unit]
Description=Sync /etc to workstation

[Service]
Type=oneshot
ExecStartPre=/usr/bin/ping -c1 -W2 workstation
ExecStart=/usr/local/bin/etc_sync.sh
jj:wq
#! No [Install] section, on purpose. A timer will start this service, and the timer is what gets enabled.
systemctl daemon-reload
clear

#^ 3. Start it and read the journal
systemctl start etc-sync.service
systemctl status etc-sync.service --no-pager
clear
journalctl -u etc-sync.service -n 10 --no-pager
clear

#^ 4. Break the check and watch the unit fail
vim /etc/systemd/system/etc-sync.service
/ExecStartPre
CExecStartPre=/usr/bin/ping -c1 -W2 192.0.2.99
jj:wq
systemctl daemon-reload
systemctl start etc-sync.service
echo "exit status: $?"
systemctl is-failed etc-sync.service
clear
journalctl -u etc-sync.service -n 5 --no-pager
#! A backup that did not happen is a problem, so systemd records it as one
systemctl --failed
#! The unit stays failed until it succeeds or you reset it. Cron has nothing like this.
clear

#^ 5. Restore the check
vim /etc/systemd/system/etc-sync.service
/ExecStartPre
CExecStartPre=/usr/bin/ping -c1 -W2 workstation
jj:wq
systemctl daemon-reload
systemctl start etc-sync.service
systemctl is-failed etc-sync.service
systemctl --failed
#! Leave the service in place. The timer exercise schedules this same unit.

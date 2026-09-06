kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: A Service That Checks Before It Runs
# Requirements
#   Hosts: servera and workstation
#   Sync /etc from servera to workstation
#   The job must refuse to run when workstation is unreachable
# Tasks
#   1. Write the sync script
#   2. Write a service unit for it
#   3. Start it and read the journal
#   4. Try to enable it
#   5. Break the check and watch the run be skipped
#   6. Restore the check
clear

#^ 1. Write the sync script
sudo -i
dnf install -y rsync
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
ExecCondition=/usr/bin/ping -c1 -W2 workstation
ExecStart=/usr/local/bin/etc_sync.sh
jj:wq
#! No [Install] section, on purpose. Step 4 shows why.
systemctl daemon-reload
clear

#^ 3. Start it and read the journal
systemctl start etc-sync.service
systemctl status etc-sync.service --no-pager
journalctl -u etc-sync.service -n 10 --no-pager
clear

#^ 4. Try to enable it
systemctl enable etc-sync.service
#! systemd has nowhere to link it. A timer will start this service instead.
clear

#^ 5. Break the check and watch the run be skipped
vim /etc/systemd/system/etc-sync.service
/ExecCondition
ccExecCondition=/usr/bin/ping -c1 -W2 192.0.2.99
jj:wq
systemctl daemon-reload
systemctl start etc-sync.service
echo "exit status: $?"
systemctl is-failed etc-sync.service
journalctl -u etc-sync.service -n 5 --no-pager
#! Skipped, not failed. A job that correctly declines to run is not an error.
clear

#^ 6. Restore the check
vim /etc/systemd/system/etc-sync.service
/ExecCondition
ccExecCondition=/usr/bin/ping -c1 -W2 workstation
jj:wq
systemctl daemon-reload
systemctl start etc-sync.service
systemctl is-failed etc-sync.service
#! Leave the service in place. The timer exercise schedules this same unit.

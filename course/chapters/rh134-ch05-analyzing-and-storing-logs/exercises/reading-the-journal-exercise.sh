kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Reading the Journal
# Requirements
#   Host: servera
#   Find entries by unit and by time
#   Make the journal survive a reboot
# Tasks
#   1. Read the journal for one service
#   2. Narrow it to a time window
#   3. See how many boots are recorded
#   4. Make the journal persistent
#   5. Reboot and read the previous boot
#   6. Clean up
clear

#^ 1. Read the journal for one service
journalctl -u sshd.service
G
q
clear

#^ 2. Narrow it to a time window
journalctl --since "30 minutes ago"
G
q
journalctl -u sshd.service --since "30 minutes ago" --no-pager
clear

#^ 3. See how many boots are recorded
journalctl --list-boots
#! Only boot 0, because the journal lives in memory and is lost on reboot
ls -d /run/log/journal
ls -d /var/log/journal
clear

#^ 4. Make the journal persistent
sudo mkdir /var/log/journal
sudo journalctl --flush
ls -d /var/log/journal
clear

#^ 5. Reboot and read the previous boot
#! Wait for servera to come back before continuing
sudo reboot
ssh servera
journalctl --list-boots
journalctl -b -1 --no-pager
G
q
clear

#^ 6. Clean up
#! Removing the directory sends journald back to memory-only storage
sudo rm -rf /var/log/journal
sudo systemctl restart systemd-journald
journalctl --list-boots

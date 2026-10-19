kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Create Persistent Prioritized Swap Space
# Requirements
#   Host: servera
#   Prerequisite exercise: Create Two GPT Partitions
#   Add a swap partition that is used before the system's own
# Steps
#   1. Create a partition on /dev/sdb suitable for swap
#   2. Format /dev/sdb3 as swap space
#   3. Activate the swap space temporarily
#   4. Deactivate it
#   5. Persistently activate it with priority 5
#   6. Verify the persistent swap
#   7. Reboot to verify
clear

#^ 1. Create a partition on /dev/sdb suitable for swap
sudo -i
#@ pause 5
lsblk -fp /dev/sdb
clear
parted /dev/sdb
#! On GPT, parted asks for a name; linux-swap marks the partition's purpose
mkpart
swap1
linux-swap
2GiB
3GiB
#@ pause 5
print
quit
udevadm settle
clear

#^ 2. Format /dev/sdb3 as swap space
#@ pause 5
mkswap /dev/sdb3
clear

#^ 3. Activate the swap space temporarily
#@ pause 5
free -h
#! The system's own swap is the only one so far, at priority -2
#@ pause 5
swapon --show
swapon /dev/sdb3
#! A new swap space defaults to a lower priority than the last one
#@ pause 5
swapon --show
clear

#^ 4. Deactivate it
swapoff /dev/sdb3
#@ pause 5
swapon --show
clear

#^ 5. Persistently activate it with priority 5
#! Same append as the mount exercise
lsblk -no UUID /dev/sdb3 >> /etc/fstab
# Two > signs append. A single > would replace all of /etc/fstab
tail -1 /etc/fstab
vim /etc/fstab
#@ noenter
G
#@ noenter
IUUID=
#@ key escape
#@ pause 5
#@ noenter
A swap swap pri=5 0 0
#@ key escape
:wq
#@ pause 5
tail -3 /etc/fstab
systemctl daemon-reload
swapon -a
clear

#^ 6. Verify the persistent swap
#! Priority 5 is above the system swap at -2, so the kernel uses sdb3 first
#@ pause 5
swapon --show
clear

#^ 7. Reboot to verify
#! The SSH session ends; wait for servera to boot before reconnecting
#@ pause 15
reboot
ssh servera
#! sdb3 is active again with priority 5, without running swapon
#@ pause 5
swapon --show
clear

#^ Clean up
#! Week 11 needs /dev/sdb blank and /etc/fstab back to its original lines
sudo -i
swapoff /dev/sdb3
umount /records
#! Delete the /records and swap lines by searching for them
vim /etc/fstab
/records
#@ noenter
dd
/pri=5
#@ pause 5
#@ noenter
dd
:wq
#@ pause 5
tail -3 /etc/fstab
systemctl daemon-reload
wipefs -a /dev/sdb1 /dev/sdb2 /dev/sdb3
wipefs -a /dev/sdb
rmdir /records /mnt/records
#@ pause 5
lsblk -fp /dev/sdb
swapon --show

# Complete

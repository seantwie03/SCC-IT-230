kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Remove the LVM Setup
# Requirements
#   Host: servera
#   Prerequisite: Extend a Logical Volume
#   Tear down the LVM stack in the reverse order of creation
# Steps
#   1. Unmount /data and remove its /etc/fstab entry
#   2. Remove the logical volume
#   3. Remove the volume group
#   4. Remove the physical volumes on /dev/sdb1 and /dev/sdc1
#   5. Wipe the /dev/sdb and /dev/sdc disks
clear

#^ 1. Unmount /data and remove its /etc/fstab entry
sudo -i
umount /data
#! A leftover entry for a removed LV would stop the next boot in emergency mode
vim /etc/fstab
#! Search for the lv_data line, then dd deletes it
/lv_data
#@ noenter
dd
:wq
clear
#! The file is back to its original lines
#@ pause 5
cat /etc/fstab
systemctl daemon-reload
#! /data is an empty directory now, and no later exercise uses it
rmdir /data
clear

#^ 2. Remove the logical volume
#! Irreversible: everything in lv_data, bigfile included, is destroyed
lvremove /dev/vg_data/lv_data
y
#@ pause 5
lvs
clear

#^ 3. Remove the volume group
vgremove vg_data
#@ pause 5
vgs
clear

#^ 4. Remove the physical volumes on /dev/sdb1 and /dev/sdc1
#! The partitions stay; only the LVM labels are wiped
pvremove /dev/sdb1 /dev/sdc1
#@ pause 5
pvs
clear

#^ 5. Wipe the /dev/sdb and /dev/sdc disks
wipefs --all /dev/sdb
wipefs --all /dev/sdc
#! No partitions left: both disks are blank again
#@ pause 5
lsblk /dev/sdb /dev/sdc

# Complete

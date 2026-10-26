kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Remove LVM Storage
# Requirements
#   Host: servera
#   Prerequisite: Extend LVM Storage
#   Return all three disks to blank
# Steps
#   1. Deactivate the swap space and unmount /records
#   2. Remove both entries from /etc/fstab
#   3. Remove both logical volumes, the volume group, and the three physical volumes
#   4. Wipe /dev/sdb, /dev/sdc, and /dev/sdd
clear

#^ 1. Deactivate the swap space and unmount /records
sudo -i
swapoff /dev/vg_storage/lv_swap
umount /records
#! Only the system's own swap is left
#@ pause 5
swapon --show
clear

#^ 2. Remove both entries from /etc/fstab
vim /etc/fstab
#! Search for vg_storage; the two lines are together, so dd twice deletes both
/vg_storage
#@ noenter
dd
#@ noenter
dd
:wq
#! The file is back to its original lines
#@ pause 5
tail -3 /etc/fstab
systemctl daemon-reload
#! /records is an empty directory now
rmdir /records
clear

#^ 3. Remove both logical volumes, the volume group, and the three physical volumes
#! lvremove asks once for each LV
lvremove /dev/vg_storage/lv_records /dev/vg_storage/lv_swap
y
y
vgremove vg_storage
pvremove /dev/sdb1 /dev/sdc1 /dev/sdd1
#@ pause 5
pvs
clear

#^ 4. Wipe /dev/sdb, /dev/sdc, and /dev/sdd
wipefs --all /dev/sdb /dev/sdc /dev/sdd
#! Three blank disks, as the week started
#@ pause 5
lsblk /dev/sdb /dev/sdc /dev/sdd

# Complete

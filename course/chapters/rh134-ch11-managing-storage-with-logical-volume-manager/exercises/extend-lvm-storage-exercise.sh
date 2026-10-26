kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Extend LVM Storage
# Requirements
#   Host: servera
#   Prerequisite: Create LVM Storage
#   Grow a file system and swap space onto a third disk
# Steps
#   1. Create an lvm partition using all of /dev/sdd and add it to vg_storage
#   2. Extend lv_swap by 1 GiB
#   3. Extend lv_records with the rest of the free space and grow its file system
#   4. Verify with vgs, df, and swapon --show
clear

#^ 1. Create an lvm partition using all of /dev/sdd and add it to vg_storage
sudo -i
#! vg_storage is full: lv_swap and lv_records used every extent
#@ pause 5
vgs vg_storage
parted /dev/sdd mklabel gpt
parted /dev/sdd mkpart primary 1MiB 100%
parted /dev/sdd set 1 lvm on
udevadm settle
pvcreate /dev/sdd1
vgextend vg_storage /dev/sdd1
#! About 5 GiB free now, all of it on sdd1
#@ pause 5
vgs vg_storage
clear

#^ 2. Extend lv_swap by 1 GiB
#! Swap must be off while its LV grows
swapoff /dev/vg_storage/lv_swap
lvextend --size +1G /dev/vg_storage/lv_swap
#! mkswap writes a new signature, and a new UUID, for the new size; /etc/fstab names the LV path, so it still matches
#@ pause 5
mkswap /dev/vg_storage/lv_swap
swapon /dev/vg_storage/lv_swap
#@ pause 5
swapon --show
clear

#^ 3. Extend lv_records with the rest of the free space and grow its file system
#! --resizefs runs xfs_growfs itself; /records stays mounted
#@ pause 6
lvextend --resizefs --extents +100%FREE /dev/vg_storage/lv_records
clear

#^ 4. Verify with vgs, df, and swapon --show
vgs vg_storage
df -h /records
#@ pause 5
swapon --show

# Complete

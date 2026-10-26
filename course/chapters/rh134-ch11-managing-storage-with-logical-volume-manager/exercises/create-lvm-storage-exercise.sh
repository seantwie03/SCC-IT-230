kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Create LVM Storage
# Requirements
#   Host: servera
#   Prerequisite: Remove the LVM Setup
#   Pool two blank disks into one volume group that holds a file system and swap space
# Steps
#   1. Create an lvm partition using all of /dev/sdb, and another using all of /dev/sdc
#   2. Initialize both as physical volumes and create a volume group named vg_storage from them
#   3. Create a 1 GiB logical volume named lv_swap, and one named lv_records from the rest of the space
#   4. Format lv_records with XFS and persistently mount it on /records
#   5. Format lv_swap as swap space and persistently activate it
#   6. Verify with lsblk, df, and swapon --show
clear

#^ 1. Create an lvm partition using all of /dev/sdb, and another using all of /dev/sdc
sudo -i
#@ pause 5
lsblk
clear
#! 100% ends each partition at the end of its disk
parted /dev/sdb mklabel gpt
parted /dev/sdb mkpart primary 1MiB 100%
parted /dev/sdb set 1 lvm on
parted /dev/sdc mklabel gpt
parted /dev/sdc mkpart primary 1MiB 100%
parted /dev/sdc set 1 lvm on
udevadm settle
#@ pause 5
lsblk /dev/sdb /dev/sdc
clear

#^ 2. Initialize both as physical volumes and create a volume group named vg_storage from them
pvcreate /dev/sdb1 /dev/sdc1
vgcreate vg_storage /dev/sdb1 /dev/sdc1
#! About 10 GiB: both disks in one pool
#@ pause 5
vgs vg_storage
clear

#^ 3. Create a 1 GiB logical volume named lv_swap, and one named lv_records from the rest of the space
#! lv_swap starts where lv_data did, so lvcreate finds its old XFS signature and asks; y wipes it
lvcreate --name lv_swap --size 1G vg_storage
y
#! lv_records starts at the beginning of sdc1, where lv_data's XFS kept a copy of its superblock; y again
lvcreate --name lv_records --extents 100%FREE vg_storage
y
#! lv_records is about 9 GiB, larger than either disk: it spans both
#@ pause 5
lvs vg_storage
clear

#^ 4. Format lv_records with XFS and persistently mount it on /records
#@ pause 5
mkfs.xfs /dev/vg_storage/lv_records
clear
mkdir /records
vim /etc/fstab
#@ noenter
G
#@ noenter
o
#@ pause 5
#@ noenter
/dev/vg_storage/lv_records /records xfs defaults 0 0
#@ key escape
:wq
systemctl daemon-reload
mount /records
clear

#^ 5. Format lv_swap as swap space and persistently activate it
mkswap /dev/vg_storage/lv_swap
vim /etc/fstab
#@ noenter
G
#@ noenter
o
#! A swap line uses swap as its mount point
#@ pause 5
#@ noenter
/dev/vg_storage/lv_swap swap swap defaults 0 0
#@ key escape
:wq
#@ pause 5
tail -3 /etc/fstab
systemctl daemon-reload
swapon -a
clear

#^ 6. Verify with lsblk, df, and swapon --show
#! lv_records sits under both sdb1 and sdc1
#@ pause 5
lsblk
clear
df -h /records
#! swapon --show names the swap LV by its kernel name, dm-2
#@ pause 5
swapon --show

# Complete

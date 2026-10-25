kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Create a Logical Volume
# Requirements
#   Host: servera
#   Prerequisite: Create a Volume Group
#   Carve a logical volume from vg_data and mount it at boot
# Steps
#   1. Create a logical volume named lv_data using all available space in vg_data
#   2. Format lv_data with an ext4 file system
#   3. Persistently mount lv_data on /data
#   4. Verify with lsblk, df, and lvdisplay
clear

#^ 1. Create a logical volume named lv_data using all available space in vg_data
sudo -i
#! 100%FREE takes all 63 free extents in vg_data, so lv_data is 252 MiB
lvcreate --name lv_data --extents 100%FREE vg_data
#@ pause 5
lvs
clear

#^ 2. Format lv_data with an ext4 file system
#! ext4, because mkfs.xfs needs a volume larger than 300 MB
#@ pause 5
mkfs.ext4 /dev/vg_data/lv_data
clear

#^ 3. Persistently mount lv_data on /data
mkdir /data
vim /etc/fstab
#@ noenter
G
#@ noenter
o
#! The LV path stays the same across reboots, so it can stand in for a UUID
#@ pause 5
#@ noenter
/dev/vg_data/lv_data /data ext4 defaults 0 0
#@ key escape
:wq
clear
#@ pause 5
cat /etc/fstab
systemctl daemon-reload
mount /data
clear

#^ 4. Verify with lsblk, df, and lvdisplay
#! lv_data sits under sdb1 and is mounted on /data
#@ pause 5
lsblk
clear
#@ pause 5
df -h /data
clear
#! Current LE 63: lv_data uses every extent in vg_data
#@ pause 5
lvdisplay /dev/vg_data/lv_data

# Complete

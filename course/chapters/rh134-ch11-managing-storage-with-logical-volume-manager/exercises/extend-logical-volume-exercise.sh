kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Extend a Logical Volume
# Requirements
#   Host: servera
#   Prerequisite: Create a Logical Volume
#   Grow a full logical volume without unmounting it
# Steps
#   1. Fill lv_data completely
#   2. Confirm that further writes fail with "No space left on device"
#   3. Add a 512 MiB lvm partition on /dev/sdc to vg_data without unmounting /data
#   4. Extend lv_data by 200 MiB
#   5. Grow the XFS file system
#   6. Confirm that writes to /data succeed again
clear

#^ 1. Fill lv_data completely
sudo -i
#@ pause 5
df -h /data
clear
#! Without count=, dd writes until /data is full, so the error is the expected result;
#! bs=4k matches XFS's 4 KiB block size, so dd fills the very last block
#@ pause 6
dd if=/dev/zero of=/data/bigfile bs=4k
clear

#^ 2. Confirm that further writes fail with "No space left on device"
df -h /data
#! Not even a 5-byte file fits: the shell cannot create testfile
#@ pause 5
echo "test" > /data/testfile
clear

#^ 3. Add a 512 MiB lvm partition on /dev/sdc to vg_data without unmounting /data
#! /data stays mounted the whole time: the VG grows while lv_data is in use
parted /dev/sdc
mklabel
gpt
mkpart
pv2
#! Accept the default type, as in the first exercise
#@ key enter
1MiB
#! Ending at 513MiB makes the partition exactly 512 MiB, since it starts at 1MiB
513MiB
set
1
lvm
on
#@ pause 5
print
quit
udevadm settle
pvcreate /dev/sdc1
vgextend vg_data /dev/sdc1
#! Two PVs now, and 508 MiB free: the new PV's 127 extents
#@ pause 5
vgs vg_data
clear

#^ 4. Extend lv_data by 200 MiB
#! The size-change line is the proof: 127 extents to 177
lvextend --size +200M /dev/vg_data/lv_data
#@ pause 5
lvs vg_data
clear

#^ 5. Grow the XFS file system
#! lvextend grew the LV only; xfs_growfs grows the file system to fill it, and takes the mount point
xfs_growfs /data
#@ pause 5
df -h /data
clear

#^ 6. Confirm that writes to /data succeed again
echo "test" > /data/testfile
#@ pause 5
cat /data/testfile

# Complete

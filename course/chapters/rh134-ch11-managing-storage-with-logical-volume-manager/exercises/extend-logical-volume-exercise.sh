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
#   3. Add a 256 MiB lvm partition on /dev/sdc to vg_data without unmounting /data
#   4. Extend lv_data by 200 MiB
#   5. Grow the ext4 file system
#   6. Confirm that writes to /data succeed again
clear

#^ 1. Fill lv_data completely
sudo -i
#@ pause 5
df -h /data
clear
#! Without count=, dd writes until /data is full, so the error is the expected result
#@ pause 6
dd if=/dev/zero of=/data/bigfile bs=1M
clear

#^ 2. Confirm that further writes fail with "No space left on device"
df -h /data
#! The shell creates testfile before echo fails, so it is left empty
#@ pause 5
echo "test" > /data/testfile
clear

#^ 3. Add a 256 MiB lvm partition on /dev/sdc to vg_data without unmounting /data
#! /data stays mounted the whole time: the VG grows while lv_data is in use
parted /dev/sdc
mklabel
gpt
mkpart
pv2
#! Accept the default type, as in the first exercise
#@ key enter
1MiB
#! Ending at 257MiB makes the partition exactly 256 MiB, since it starts at 1MiB
257MiB
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
#! Two PVs now, and 252 MiB free: the new PV's 63 extents
#@ pause 5
vgs vg_data
clear

#^ 4. Extend lv_data by 200 MiB
#! The size-change line is the proof: 63 extents to 113
lvextend --size +200M /dev/vg_data/lv_data
#@ pause 5
lvs vg_data
clear

#^ 5. Grow the ext4 file system
#! lvextend grew the LV only; resize2fs grows the file system to fill it, still mounted
resize2fs /dev/vg_data/lv_data
#@ pause 5
df -h /data
clear

#^ 6. Confirm that writes to /data succeed again
echo "test" > /data/testfile
#@ pause 5
cat /data/testfile

# Complete

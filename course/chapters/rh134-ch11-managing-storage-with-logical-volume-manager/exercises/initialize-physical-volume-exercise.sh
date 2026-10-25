kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Initialize a Physical Volume
# Requirements
#   Host: servera
#   Prepare a partition on a blank disk for LVM
# Steps
#   1. Create a 256 MiB GPT partition with the lvm flag on /dev/sdb
#   2. Initialize /dev/sdb1 as a physical volume
#   3. Verify with pvs and pvdisplay
clear

#^ 1. Create a 256 MiB GPT partition with the lvm flag on /dev/sdb
sudo -i
#@ pause 5
lsblk
clear
#! Why a partition and not the whole disk? pvcreate accepts /dev/sdb as it is,
#! but then parted and plain lsblk show the disk as empty, and parted's mklabel
#! overwrites the PV without asking. A partition flagged lvm shows what the disk holds
parted /dev/sdb
mklabel
gpt
mkpart
pv1
#! Accept the default type: it is only a hint, and the lvm flag marks the partition
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
clear

#^ 2. Initialize /dev/sdb1 as a physical volume
pvcreate /dev/sdb1
clear

#^ 3. Verify with pvs and pvdisplay
#@ pause 5
pvs
clear
#! A new PV: 256 MiB, no volume group yet, and no extents until it joins one
#@ pause 5
pvdisplay /dev/sdb1

# Complete

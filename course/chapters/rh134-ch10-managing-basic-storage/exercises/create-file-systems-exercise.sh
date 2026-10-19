kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Create File Systems on /dev/sdb
# Requirements
#   Host: servera
#   Prerequisite exercise: Create Two GPT Partitions
#   Put an XFS and an ext4 file system on the two GPT partitions
# Steps
#   1. Inspect /dev/sdb
#   2. Create an XFS file system on /dev/sdb1
#   3. Create an ext4 file system on /dev/sdb2
#   4. Verify the file systems
clear

#^ 1. Inspect /dev/sdb
sudo -i
#! Two partitions from the GPT exercise and no file systems yet
#@ pause 5
lsblk -fp /dev/sdb
clear

#^ 2. Create an XFS file system on /dev/sdb1
#! The xfs answer in parted only set the partition type; mkfs.xfs writes the file system
#@ pause 5
mkfs.xfs /dev/sdb1
clear

#^ 3. Create an ext4 file system on /dev/sdb2
#@ pause 5
mkfs.ext4 /dev/sdb2
clear

#^ 4. Verify the file systems
#! Each partition now reports its file system type and a UUID
#! The next exercises mount these file systems, so leave them in place
#@ pause 5
lsblk -fp /dev/sdb

# Complete

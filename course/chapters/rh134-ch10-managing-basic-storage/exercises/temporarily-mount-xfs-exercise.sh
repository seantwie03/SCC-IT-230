kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Temporarily Mount an XFS File System
# Requirements
#   Host: servera
#   Prerequisite exercise: Create File Systems
#   Mount a file system by hand, then unmount it
# Steps
#   1. Inspect /dev/sdb
#   2. Create the mount point /mnt/records
#   3. Temporarily mount /dev/sdb1 on /mnt/records
#   4. Verify the mount
#   5. Unmount /dev/sdb1
#   6. Verify it is unmounted
clear

#^ 1. Inspect /dev/sdb
sudo -i
#! XFS on sdb1 and ext4 on sdb2 from the last exercise; neither is mounted
#@ pause 5
lsblk -fp /dev/sdb
clear

#^ 2. Create the mount point /mnt/records
mkdir /mnt/records
ls /mnt
clear

#^ 3. Temporarily mount /dev/sdb1 on /mnt/records
#! Like cp: the file system first, then the mount point
mount /dev/sdb1 /mnt/records
clear

#^ 4. Verify the mount
#! FSAVAIL, FSUSE%, and MOUNTPOINTS are filled in now
#@ pause 5
lsblk -fp /dev/sdb
#@ pause 5
mount | grep /mnt/records
clear

#^ 5. Unmount /dev/sdb1
#! umount, not unmount
umount /mnt/records
clear

#^ 6. Verify it is unmounted
#@ pause 5
lsblk -fp /dev/sdb
#! No output: /dev/sdb1 is no longer mounted
mount | grep /mnt/records

# Complete

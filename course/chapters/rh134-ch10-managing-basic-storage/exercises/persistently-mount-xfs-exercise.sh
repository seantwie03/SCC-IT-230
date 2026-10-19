kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Persistently Mount an XFS File System
# Requirements
#   Host: servera
#   Prerequisite exercise: Create File Systems
#   Mount a file system at every boot
# Steps
#   1. Inspect /dev/sdb
#   2. Create the mount point /records
#   3. Persistently mount /dev/sdb1 on /records
#   4. Test with mount -av
#   5. Reboot and verify
clear

#^ 1. Inspect /dev/sdb
sudo -i
#@ pause 5
lsblk -fp /dev/sdb
clear

#^ 2. Create the mount point /records
mkdir /records
#@ pause 5
ls /
clear

#^ 3. Persistently mount /dev/sdb1 on /records
#! -n drops the header and -o UUID prints only the UUID, so the line is exact
lsblk -no UUID /dev/sdb1 >> /etc/fstab
# Two > signs append. A single > would replace all of /etc/fstab
tail -1 /etc/fstab
vim /etc/fstab
#@ noenter
G
#@ noenter
IUUID=
#@ key escape
#@ pause 5
#@ noenter
A /records xfs defaults 0 0
#@ key escape
:wq
#@ pause 5
tail -5 /etc/fstab
systemctl daemon-reload
clear

#^ 4. Test with mount -av
#! The SELinux warning is expected: the new file system has no labels yet
#@ pause 8
mount -av
#! restorecon labels the new file system, so the warning does not come back
restorecon -Rv /records
#@ pause 5
lsblk -fp /dev/sdb
clear

#^ 5. Reboot and verify
#! The SSH session ends; wait for servera to boot before reconnecting
#@ pause 15
reboot
ssh servera
#! /records is mounted again without running mount
#@ pause 5
lsblk -fp /dev/sdb

# Complete

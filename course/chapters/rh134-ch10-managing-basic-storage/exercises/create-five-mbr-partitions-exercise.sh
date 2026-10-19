kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Create Five MBR Partitions on /dev/sdc
# Requirements
#   Host: servera
#   Use an extended partition to get past MBR's four-partition limit
# Steps
#   1. Inspect the storage device /dev/sdc
#   2. Create an msdos disk label
#   3. Create three primary partitions, 500 MiB each
#   4. Create an extended partition in the remaining space
#   5. Create a 1 GiB logical partition inside it
#   6. Verify the partitions
clear

#^ 1. Inspect the storage device /dev/sdc
sudo -i
#@ pause 5
lsblk -fp
clear
#@ pause 5
parted /dev/sdc print
clear

#^ 2. Create an msdos disk label
parted /dev/sdc
mklabel
msdos
print

#^ 3. Create three primary partitions, 500 MiB each
mkpart
primary
xfs
1MiB
501MiB
mkpart
primary
xfs
501MiB
1001MiB
mkpart
primary
xfs
1001MiB
1501MiB
#@ pause 5
print

#^ 4. Create an extended partition in the remaining space
#! MBR allows four primary partitions, and the extended one takes the fourth slot
mkpart
extended
1501MiB
100%

#^ 5. Create a 1 GiB logical partition inside it
#! The prompt now offers only logical
#! Start 1 MiB inside the extended partition, whose first sector holds its own table
mkpart
logical
xfs
1502MiB
2526MiB
#@ pause 5
print
quit
udevadm settle
clear

#^ 6. Verify the partitions
#! Logical partitions number from 5, and sdc4 is the 1K extended container
#@ pause 5
lsblk -fp /dev/sdc
clear

#^ Clean up
#! Nothing later uses /dev/sdc, so wipe its partition table now
wipefs -a /dev/sdc
#@ pause 5
lsblk -fp /dev/sdc

# Complete

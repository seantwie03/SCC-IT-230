kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Create Two GPT Partitions on /dev/sdb
# Requirements
#   Host: servera
#   Partition a blank disk with a GPT label
# Steps
#   1. Inspect the storage device /dev/sdb
#   2. Create a gpt disk label
#   3. Create two partitions, 1 GiB each
#   4. Verify the partitions
clear

#^ 1. Inspect the storage device /dev/sdb
sudo -i
#@ pause 5
lsblk -fp
clear
#! A blank disk has no label yet, so parted reports "unrecognised disk label"
#@ pause 5
parted /dev/sdb print
clear

#^ 2. Create a gpt disk label
parted /dev/sdb
mklabel
#! Press Tab twice at the prompt to see every label type
gpt
print

#^ 3. Create two partitions, 1 GiB each
#! On a GPT label, parted asks for a name instead of a type
mkpart
data1
xfs
1MiB
1GiB
mkpart
data2
ext4
1GiB
2GiB
#@ pause 5
print
quit
udevadm settle
clear

#^ 4. Verify the partitions
#! Two partitions and no file systems yet: the xfs and ext4 answers do not create them
#! The next exercise does
#@ pause 5
lsblk -fp /dev/sdb

# Complete

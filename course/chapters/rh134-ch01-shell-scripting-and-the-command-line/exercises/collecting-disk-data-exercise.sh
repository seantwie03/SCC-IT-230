kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Collecting Disk Data
# Requirements
#   Hosts: servera and workstation
#   Script location: /home/student/scripts/collect_disk_data.sh
#   The script must run when called by name
#   The script must accept any number of host names as arguments
#   Run lsblk and df -h on each host
#   Store the output in /tmp/disk-data/{HOST}-disk-data.txt
# Tasks
#   1. Create a basic script file
#   2. Make it executable
#   3. Write a basic for loop
#   4. Iterate on the logic
#   5. Make the script take arguments
#   6. Clean up
clear

#^ 1. Create a basic script file
mkdir -p ~/scripts
cd ~/scripts
vim collect_disk_data.sh
#! Press enter, backspace, enter after the next command.
i#!/bin/bash
#@ pause 5
echo "Starting $0"
#@ key escape
:wq
bash collect_disk_data.sh

#^ 2. Make it executable
chmod a+x collect_disk_data.sh
./collect_disk_data.sh
clear

#^ 3. Write a basic for loop
vim collect_disk_data.sh
/Starting \$0
#@ noenter
o
for host in workstation servera; do
    echo $host
#@ pause 5
done
#@ key escape
:wq
./collect_disk_data.sh
clear

#^ 4. Iterate on the logic
#! Get one host working by hand before putting it in the loop.
mkdir -p /tmp/disk-data
ssh student@servera lsblk > /tmp/disk-data/servera-disk-data.txt
ssh student@servera df -h >> /tmp/disk-data/servera-disk-data.txt
ls -l /tmp/disk-data
#@ pause 5
cat /tmp/disk-data/servera-disk-data.txt
clear
vim collect_disk_data.sh
/echo \$host
A > /tmp/disk-data/$host-disk-data.txt
    ssh student@$host lsblk >> /tmp/disk-data/$host-disk-data.txt
#@ pause 5
#@ noenter
    ssh student@$host df -h >> /tmp/disk-data/$host-disk-data.txt
#@ key escape
:wq
clear
#@ pause 10
./collect_disk_data.sh
ls -l /tmp/disk-data
#@ pause 5
cat /tmp/disk-data/workstation-disk-data.txt
clear

#^ 5. Make the script take arguments
#! The host list is hard coded. Replace it with "$@" so the caller chooses.
vim collect_disk_data.sh
/for host in
#! w 3 times to move forward three words
#@ noenter
#@ pause 3
www
#! Change to ;
#@ noenter
ct;
#@ pause 5
#@ noenter
"$@"
#@ key escape
:wq
#@ pause 5
cat collect_disk_data.sh
rm -f /tmp/disk-data/*
#@ pause 10
./collect_disk_data.sh workstation servera
ls -l /tmp/disk-data
#@ pause 5
cat /tmp/disk-data/servera-disk-data.txt
clear

#^ 6. Clean up
rm -rf /tmp/disk-data
rm ~/scripts/collect_disk_data.sh
y

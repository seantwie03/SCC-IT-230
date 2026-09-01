kitten @ set-font-size 30.0 && ssh servera
clear

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
echo "Starting $0"
jj:wq
bash collect_disk_data.sh

#^ 2. Make it executable
chmod a+x collect_disk_data.sh
./collect_disk_data.sh
clear

#^ 3. Write a basic for loop
vim collect_disk_data.sh
/Starting \$0
o
for host in workstation servera; do
    echo $host
done
jj:wq
./collect_disk_data.sh
clear

#^ 4. Iterate on the logic
#! Get one host working by hand before putting it in the loop.
mkdir -p /tmp/disk-data
ssh student@servera lsblk > /tmp/disk-data/servera-disk-data.txt
ssh student@servera df -h >> /tmp/disk-data/servera-disk-data.txt
ls -l /tmp/disk-data
cat /tmp/disk-data/servera-disk-data.txt
clear
vim collect_disk_data.sh
/echo \$host
A > /tmp/disk-data/$host-disk-data.txt
    ssh student@$host lsblk >> /tmp/disk-data/$host-disk-data.txt
    ssh student@$host df -h >> /tmp/disk-data/$host-disk-data.txt
jj:wq
clear
./collect_disk_data.sh
ls -l /tmp/disk-data
cat /tmp/disk-data/workstation-disk-data.txt
clear

#^ 5. Make the script take arguments
#! The host list is hard coded. Replace it with "$@" so the caller chooses.
vim collect_disk_data.sh
/for host in
#! w 3 times to move forward three words
www
#! Change to ;
ct;
"$@"
jj:wq
cat collect_disk_data.sh
rm -f /tmp/disk-data/*
./collect_disk_data.sh workstation servera
ls -l /tmp/disk-data
cat /tmp/disk-data/servera-disk-data.txt
clear

#^ 6. Clean up
rm -rf /tmp/disk-data
rm ~/scripts/collect_disk_data.sh
cd ~

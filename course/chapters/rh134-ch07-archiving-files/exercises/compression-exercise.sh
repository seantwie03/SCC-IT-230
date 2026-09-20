kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Comparing Compression Algorithms
# Requirements
#   Host: servera
#   Prerequisite: Creating and Extracting Archives
#   Find which compressor makes the smallest /etc backup, and at what cost
# Steps
#   1. gzip with -z
#   2. bzip2 with -j, after installing it
#   3. xz with -J
#   4. Compare all four archives
#   5. Ask gzip and xz for their ratios
#   6. Extract without naming the algorithm
#   7. Clean up
clear

#^ 1. gzip with -z
#! This exercise continues from the uncompressed /tmp/etc-backup.tar you already built
sudo -i
ls -lh /tmp/etc-backup.tar
#@ pause 5
dnf info gzip
clear
#! time reports how long the archive took to build, the CPU half of the trade
#@ pause 5
time tar -czvf /tmp/etc-backup.tar.gz /etc
clear

#^ 2. bzip2 with -j, after installing it
#! bzip2 is not part of a minimal installation, so install it first
#@ pause 5
dnf info bzip2
#@ pause 6
dnf install -y bzip2
clear
#@ pause 5
time tar -cjvf /tmp/etc-backup.tar.bz2 /etc
clear

#^ 3. xz with -J
#! Lowercase -j is bzip2. Uppercase -J is xz. They are different options.
#@ pause 5
dnf info xz
clear
#! xz runs for about 4.5 seconds, so the hold has to outlast the command and leave time to read the result
#@ pause 10
time tar -cJvf /tmp/etc-backup.tar.xz /etc
clear

#^ 4. Compare all four archives
#@ pause 5
ls -lh --sort=size /tmp/etc-backup.tar*
#! Set these sizes beside the real times from each run: xz is smallest and slowest
clear

#^ 5. Ask gzip and xz for their ratios
gzip -l /tmp/etc-backup.tar.gz
#@ pause 5
xz -l /tmp/etc-backup.tar.xz
clear

#^ 6. Extract without naming the algorithm
#! tar detects the compression on its own. No -J needed.
mkdir -p /tmp/etc-xz-extract
cd /tmp/etc-xz-extract
tar -xf /tmp/etc-backup.tar.xz
ls
clear

#^ 7. Clean up
cd /tmp
rm -rf /tmp/etc-backup.tar* /tmp/etc-extract /tmp/etc-one /tmp/etc-xz-extract
#@ pause 6
dnf remove -y bzip2
exit

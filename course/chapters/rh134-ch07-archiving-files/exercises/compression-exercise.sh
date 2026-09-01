kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Compare gzip, bzip2, and xz
#! This exercise continues from the uncompressed /tmp/etc-backup.tar you already built.
sudo -i
ls -lh /tmp/etc-backup.tar
clear

#^ 1. gzip with -z
dnf info gzip
tar -czvf /tmp/etc-backup.tar.gz /etc
clear

#^ 2. bzip2 with -j
#! bzip2 is not part of a minimal installation, so install it first.
dnf info bzip2
dnf install -y bzip2
clear
tar -cjvf /tmp/etc-backup.tar.bz2 /etc
clear

#^ 3. xz with -J
#! Lowercase -j is bzip2. Uppercase -J is xz. They are different options.
dnf info xz
tar -cJvf /tmp/etc-backup.tar.xz /etc
clear

#^ 4. Compare all four archives
ls -lh --sort=size /tmp/etc-backup.tar*
clear

#^ 5. Ask each compressor for its ratio
gzip -l /tmp/etc-backup.tar.gz
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
ls /tmp

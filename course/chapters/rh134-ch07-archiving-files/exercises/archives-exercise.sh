kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Creating and Extracting Archives
# Requirements
#   Host: servera
#   Back up /etc and restore it somewhere safe
# Steps
#   1. Bundle all of /etc as root into one uncompressed archive under /tmp
#   2. Check the size of the archive you produced
#   3. Read the archive's contents without unpacking it
#   4. Unpack the archive into an empty directory of its own
#   5. Confirm the extracted tree looks like the original
#   6. Extract a single file into a fresh directory
clear

#^ 1. Bundle all of /etc as root into one uncompressed archive under /tmp
#! Reading every file under /etc requires root
sudo -i
#! -c creates, -v lists each member as it is added, -f names the archive
#@ pause 5
tar -cvf /tmp/etc-backup.tar /etc
#! tar strips the leading slash, so extracting somewhere else cannot overwrite /etc
clear

#^ 2. Check the size of the archive you produced
ls -lh /tmp/etc-backup.tar
clear

#^ 3. Read the archive's contents without unpacking it
#! -t lists. The member names have no leading slash.
#@ pause 5
tar -tf /tmp/etc-backup.tar | head -n 20
clear

#^ 4. Unpack the archive into an empty directory of its own
#! tar unpacks into the current working directory, so move somewhere safe first
mkdir -p /tmp/etc-extract
cd /tmp/etc-extract
tar -xf /tmp/etc-backup.tar
ls
clear

#^ 5. Confirm the extracted tree looks like the original
ls -l /tmp/etc-extract/etc | head -n 10
#@ pause 5
diff /tmp/etc-extract/etc/hosts /etc/hosts
#! No output from diff means the two files are identical
clear

#^ 6. Extract a single file into a fresh directory
mkdir -p /tmp/etc-one
cd /tmp/etc-one
tar -xf /tmp/etc-backup.tar etc/hosts
ls -R /tmp/etc-one
#! Keep these files. The compression exercise builds on them and cleans them up.

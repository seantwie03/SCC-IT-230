kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Create, Inspect, and Extract an Archive
#! Reading every file under /etc requires root.
sudo -i

#^ 1. Bundle /etc into one uncompressed archive
#! -c creates, -v lists each member as it is added, -f names the archive.
tar -cvf /tmp/etc-backup.tar /etc
#! Note the warning: tar strips the leading slash so this cannot overwrite /etc on extraction.
clear

#^ 2. Check the size of the result
ls -lh /tmp/etc-backup.tar
clear

#^ 3. Read the contents without unpacking
#! -t lists. The member names have no leading slash.
tar -tf /tmp/etc-backup.tar | head -n 20
clear

#^ 4. Extract into an empty directory
#! tar unpacks into the current working directory, so move somewhere safe first.
mkdir -p /tmp/etc-extract
cd /tmp/etc-extract
tar -xf /tmp/etc-backup.tar
ls
clear

#^ 5. Confirm the extracted tree
ls -l /tmp/etc-extract/etc | head -n 10
diff /tmp/etc-extract/etc/hosts /etc/hosts
#! No output from diff means the two files are identical.
clear

#^ 6. Extract a single member into a fresh directory
mkdir -p /tmp/etc-one
cd /tmp/etc-one
tar -xf /tmp/etc-backup.tar etc/hosts
ls -R /tmp/etc-one
clear

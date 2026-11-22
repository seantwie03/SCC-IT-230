kitten @ action --self change_font_size current 30 && ssh serverb
clear

#@ pause 10
#^ Exercise: Build the Data Tier
# Requirements
#   Host: serverb
#   Hold all of Forgejo's data: its database in PostgreSQL, and its files shared to servera over NFS
# Steps
#   1. Tune serverb for throughput performance
#   2. Install PostgreSQL and the NFS server
#   3. Create logical volumes for PostgreSQL's data and Forgejo's files
#   4. Prepare the logical volume for PostgreSQL
#   5. Initialize PostgreSQL on its logical volume
#   6. Allow the forgejo user to connect to PostgreSQL from servera
#   7. Start PostgreSQL and create the forgejo user and database
#   8. Share Forgejo's logical volume with servera over NFS
#   9. Open the firewall for PostgreSQL and NFS
clear

#^ 1. Tune serverb for throughput performance
sudo -i
#@ pause 6
dnf install -y tuned
systemctl enable --now tuned
#! virtual-guest, because serverb is a virtual machine
tuned-adm active
#! virtual-guest builds on throughput-performance; a database server wants throughput-performance itself
tuned-adm profile throughput-performance
tuned-adm verify
clear

#^ 2. Install PostgreSQL and the NFS server
#@ pause 6
dnf install -y postgresql-server nfs-utils
clear

#^ 3. Create logical volumes for PostgreSQL's data and Forgejo's files
#! sdb, sdc, and sdd are blank; use sdb
#@ pause 5
lsblk
clear
#! 100% ends the partition at the end of the disk
parted /dev/sdb mklabel gpt
parted /dev/sdb mkpart primary 1MiB 100%
parted /dev/sdb set 1 lvm on
udevadm settle
lsblk /dev/sdb
clear
pvcreate /dev/sdb1
vgcreate vg_data /dev/sdb1
#! 2 GiB for PostgreSQL, and the rest for Forgejo's files
lvcreate --name lv_db --size 2G vg_data
lvcreate --name lv_forgejo --extents 100%FREE vg_data
lvs vg_data
clear
mkfs.xfs /dev/vg_data/lv_db
#@ pause 5
mkfs.xfs /dev/vg_data/lv_forgejo
clear
mkdir /srv/db /srv/forgejo
vim /etc/fstab
#@ noenter
G
#@ noenter
o
/dev/vg_data/lv_db /srv/db xfs defaults 0 0
#@ pause 5
#@ noenter
/dev/vg_data/lv_forgejo /srv/forgejo xfs defaults 0 0
#@ key escape
:wq
systemctl daemon-reload
#! The SELinux warnings are expected: the new file systems have no labels yet, and steps 4 and 8 give them some
#@ pause 8
mount -av
df -h /srv/db /srv/forgejo
clear

#^ 4. Prepare the logical volume for PostgreSQL
#! The data goes one directory below the mount point, which PostgreSQL recommends
mkdir /srv/db/pgsql
chown postgres:postgres /srv/db/pgsql
chmod 700 /srv/db/pgsql
#! A new file system has no labels, and no rule covers /srv/db
ls -ldZ /srv/db /srv/db/pgsql
semanage fcontext -a -t postgresql_db_t '/srv/db(/.*)?'
#@ pause 5
restorecon -Rv /srv/db
clear

#^ 5. Initialize PostgreSQL on its logical volume
#! systemctl edit opens a drop-in file in vim, with the cursor between the two marker lines
systemctl edit postgresql
#@ noenter
i
[Service]
#@ pause 5
#@ noenter
Environment=PGDATA=/srv/db/pgsql/data
#@ key escape
:wq
#! The drop-in comes last, so its PGDATA replaces the unit's
#@ pause 5
systemctl cat postgresql | tail -3
postgresql-setup --initdb
#! initdb's files inherit the label from step 4
ls -ldZ /srv/db/pgsql/data
clear

#^ 6. Allow the forgejo user to connect to PostgreSQL from servera
#! PostgreSQL listens only on localhost until listen_addresses adds serverb's lab address
#! listen_addresses picks the addresses PostgreSQL listens on; pg_hba.conf and the firewall decide who may connect
vim /srv/db/pgsql/data/postgresql.conf
/^#listen_addresses
#@ noenter
o
#@ pause 5
#@ noenter
listen_addresses = 'localhost,172.25.250.11'
#@ key escape
:wq
#! Each line: connection type, database, user, client address, and authentication method
vim /srv/db/pgsql/data/pg_hba.conf
#@ noenter
G
#@ noenter
o
#@ pause 5
#@ noenter
host    forgejo    forgejo    172.25.250.10/32    scram-sha-256
#@ key escape
:wq
clear

#^ 7. Start PostgreSQL and create the forgejo user and database
systemctl enable --now postgresql
#! postgres is PostgreSQL's administrator, and psql its client
su - postgres
psql
CREATE USER forgejo WITH PASSWORD 'redhat';
CREATE DATABASE forgejo OWNER forgejo;
\q
exit
clear

#^ 8. Share Forgejo's logical volume with servera over NFS
#! NFS keeps each file's UID; Forgejo will run as forgejo, UID 2000, on servera, so the same UID owns the share here
useradd -u 2000 forgejo
chown forgejo:forgejo /srv/forgejo
#! Like /srv/db, the new file system has no label; restorecon gives it the default for /srv
restorecon -Rv /srv/forgejo
vim /etc/exports
#@ noenter
i
#@ pause 5
#@ noenter
/srv/forgejo servera.lab.example.com(rw)
#@ key escape
:wq
systemctl enable --now nfs-server
#@ pause 5
exportfs -v
clear

#^ 9. Open the firewall for PostgreSQL and NFS
firewall-cmd --permanent --add-service=postgresql
#! rpc-bind and mountd are only for showmount, which the next exercise uses from servera
firewall-cmd --permanent --add-service=nfs --add-service=rpc-bind --add-service=mountd
firewall-cmd --reload
#@ pause 5
firewall-cmd --list-services
#! The next exercise connects Forgejo on servera to this database and this share

# Complete

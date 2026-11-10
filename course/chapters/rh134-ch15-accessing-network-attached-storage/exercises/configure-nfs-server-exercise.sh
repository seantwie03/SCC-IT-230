kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Configure an NFS Server
# Requirements
#   Host: servera
#   Share a directory on servera with the lab network
# Steps
#   1. Install nfs-utils
#   2. Create /srv/reports and give it to student
#   3. Export it read/write to 172.25.250.0/24
#   4. Enable and start the nfs-server service
#   5. Open the firewall for NFS
#   6. Verify the export with exportfs -v
clear

#^ 1. Install nfs-utils
sudo -i
#@ pause 6
dnf install -y nfs-utils
clear

#^ 2. Create /srv/reports and give it to student
mkdir /srv/reports
#! root_squash: student on workstation writes here in the next exercise; root cannot
chown student:student /srv/reports
ls -ld /srv/reports
clear

#^ 3. Export it read/write to 172.25.250.0/24
#! No space between the subnet and the parenthesis
vim /etc/exports
#@ pause 5
#@ noenter
i/srv/reports  172.25.250.0/24(rw,sync)
#@ key escape
:wq
cat /etc/exports
clear

#^ 4. Enable and start the nfs-server service
#! Starting the server also reads /etc/exports, so the export is live now
systemctl enable nfs-server --now
clear

#^ 5. Open the firewall for NFS
#! nfs for the mounts; rpc-bind and mountd so showmount works from workstation
firewall-cmd --add-service=nfs --add-service=rpc-bind --add-service=mountd
firewall-cmd --runtime-to-permanent
#@ pause 6
firewall-cmd --list-all
clear

#^ 6. Verify the export with exportfs -v
#! rw and sync as written; root_squash and the rest are defaults
#@ pause 6
exportfs -v

# Complete

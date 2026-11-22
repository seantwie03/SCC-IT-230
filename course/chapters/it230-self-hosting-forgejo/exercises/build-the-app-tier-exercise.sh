kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Build the App Tier
# Requirements
#   Host: servera
#   Prerequisite exercise: Build the Data Tier
#   Run Forgejo in a container, as a service of a user of its own, with all of its data on serverb
# Steps
#   1. Install Podman, autofs, and the NFS client
#   2. Create the user forgejo, with UID 2000, a password, and lingering
#   3. Automount Forgejo's files from serverb on forgejo's ~/data
#   4. Run Forgejo in a container as the forgejo user
#   5. Create Forgejo's first admin
#   6. Run the container as a user service that starts at boot
clear

#^ 1. Install Podman, autofs, and the NFS client
#! autofs does not bring nfs-utils, which holds mount.nfs
#@ pause 25
sudo dnf install -y podman autofs nfs-utils
clear

#^ 2. Create the user forgejo, with UID 2000, a password, and lingering
#! UID 2000 matches the owner of the share on serverb
sudo useradd -u 2000 forgejo
#! passwd warns that redhat is short, and sets it anyway because root asked
sudo passwd forgejo
redhat
redhat
#! Lingering starts forgejo's services at boot and keeps them running after it logs out
sudo loginctl enable-linger forgejo
loginctl list-users
clear

#^ 3. Automount Forgejo's files from serverb on forgejo's ~/data
#! serverb opened rpc-bind and mountd, so showmount can list its exports
showmount --exports serverb
#! A direct map names the full path of each mount point
sudo vim /etc/auto.master.d/forgejo.autofs
#@ noenter
i
#@ pause 5
#@ noenter
/-  /etc/auto.forgejo
#@ key escape
:wq
sudo vim /etc/auto.forgejo
#@ noenter
i
#@ pause 5
#@ noenter
/home/forgejo/data  -rw,sync  serverb.lab.example.com:/srv/forgejo
#@ key escape
:wq
sudo systemctl enable --now autofs
#! Only the autofs trigger: nothing from serverb yet
mount | grep forgejo
#! Listing the mount point's contents mounts the share; forgejo's home is private, so sudo
sudo ls -la /home/forgejo/data
#! The autofs trigger and, below it, the nfs4 mount from serverb
#@ pause 5
mount | grep forgejo
clear

#^ 4. Run Forgejo in a container as the forgejo user
#! SSH, not su - or sudo -iu: only a login session gives forgejo a systemd of its own
ssh forgejo@servera
redhat
#! The rootless image runs Forgejo as a regular user, keeps its data in /var/lib/gitea, and serves SSH on 2222
#! keep-id makes Forgejo's own UID, 1000, forgejo's UID, so its files on serverb belong to forgejo
podman run -d --name forgejo --network host --userns keep-id:uid=1000,gid=1000 \
-v ~/data:/var/lib/gitea:Z \
-e FORGEJO__server__ROOT_URL=http://git.lab.example.com/ \
-e FORGEJO__security__INSTALL_LOCK=true \
-e FORGEJO__database__DB_TYPE=postgres \
-e FORGEJO__database__HOST=serverb.lab.example.com:5432 \
-e FORGEJO__database__NAME=forgejo \
-e FORGEJO__database__USER=forgejo \
-e FORGEJO__database__PASSWD=redhat \
#! The pull and Forgejo's first start took 17 seconds on the instructor lab
#@ pause 25
codeberg.org/forgejo/forgejo:15-rootless
#@ pause 5
podman ps
curl -s localhost:3000 | grep '<title>'
clear

#^ 5. Create Forgejo's first admin
#! INSTALL_LOCK skipped Forgejo's install page, so the first admin is made here
podman exec -it forgejo /bin/bash
#! The prompt changes: this shell is inside the container, as git
forgejo admin user create --admin --username student --password student --email student@lab.example.com
exit
clear

#^ 6. Run the container as a user service that starts at boot
mkdir -p ~/.config/systemd/user
cd ~/.config/systemd/user
#! If the service starts before autofs has mounted ~/data, it fails; --restart-sec 10 has systemd retry every 10 seconds instead of giving up
podman generate systemd --new --files --name --restart-sec 10 \
--wants podman-user-wait-network-online.service \
#@ pause 5
--after podman-user-wait-network-online.service forgejo
#! --new makes the service create its own container, so remove this one; the data stays on serverb
podman rm -f forgejo
systemctl --user daemon-reload
#@ pause 5
systemctl --user enable --now container-forgejo
curl -s localhost:3000 | grep '<title>'
exit
#! forgejo has logged out, and its service keeps running
curl -s localhost:3000 | grep '<title>'
#! The next exercise puts httpd in front of port 3000

# Complete

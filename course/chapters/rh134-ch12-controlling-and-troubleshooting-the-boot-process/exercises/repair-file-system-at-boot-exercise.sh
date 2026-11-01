kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Repair a File System at Boot
# Requirements
#   Host: servera, with its VM console open
#   Break the /boot entry in /etc/fstab, then repair it from the emergency shell
# Steps
#   1. Break the UUID of the /boot entry in /etc/fstab
#   2. Reboot and log in to the emergency shell as root
#   3. Check that the root file system is read/write
#   4. Find the bad entry with mount --all
#   5. Correct the entry in /etc/fstab
#   6. Reload systemd and confirm mount --all succeeds
#   7. Reboot and confirm a normal boot
clear

#^ 1. Break the UUID of the /boot entry in /etc/fstab
sudo -i
#@ pause 5
cat /etc/fstab
#! Search for the /boot line, jump to the end of its UUID, and append zzz
vim /etc/fstab
/boot
#@ noenter
0
#@ noenter
E
#@ noenter
#@ pause 5
azzz
#@ key escape
:wq
#! The UUID on the /boot line now ends in zzz, and no device has that UUID
grep /boot /etc/fstab
clear

#^ 2. Reboot and log in to the emergency shell as root
#! Bring the servera console window forward before rebooting
systemctl reboot
#! On the SCC lab a splash screen hides the boot; Esc shows the messages
#! systemd waits 1min 30s for the device with the zzz UUID, then opens the emergency shell
#! At the prompt for the root password for maintenance, type the root password

#^ 3. Check that the root file system is read/write
#! In the emergency shell on the console, run: mount | grep root
#! rw among the options: a failed mount leaves / read/write, so /etc/fstab can be edited
#! If it shows ro instead, run: mount -o remount,rw /

#^ 4. Find the bad entry with mount --all
#! On the console, run: mount --all
#! mount: /boot: can't find UUID=...zzz. names the mount point and the bad UUID

#^ 5. Correct the entry in /etc/fstab
#! On the console, run: vim /etc/fstab
#! Remove the zzz from the end of the UUID on the /boot line, then save with :wq

#^ 6. Reload systemd and confirm mount --all succeeds
#! On the console, run: systemctl daemon-reload
#! Then run: mount --all
#! No output: every entry mounted, /boot included

#^ 7. Reboot and confirm a normal boot
#! On the console, run: systemctl reboot
#! Two red "Failed to connect to system scope bus" lines are expected; the reboot goes ahead
#! Wait for servera to finish booting, then reconnect
ssh servera
#! /boot is mounted again from /dev/sda2
mount | grep /boot

# Complete

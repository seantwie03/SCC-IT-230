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
#! Students do this step and the rest up to the reconnect in the servera VM window
#! On the SCC lab a splash screen hides the boot; Esc shows the messages
#! Attach to the serial console straight after the reboot, so the boot shows from the GRUB2 menu on
#@ pause 0.5
systemctl reboot
#@ noenter
#@ pause 0
virsh -c qemu:///system console servera
#! systemd waits 1min 30s for the device with the zzz UUID, then opens the emergency shell
#! The maintenance prompt appeared 94 seconds after the attach in the Round 6 trial
#@ pause 105
#@ key enter
#! The root password, at the prompt for the root password for maintenance; it does not echo
#@ pause 5
redhat
clear

#^ 3. Check that the root file system is read/write
#! rw among the options: a failed mount leaves / read/write, so /etc/fstab can be edited
#! If it shows ro instead, run: mount -o remount,rw /
#@ pause 5
mount | grep root
clear

#^ 4. Find the bad entry with mount --all
#! mount: /boot: can't find UUID=...zzz. names the mount point and the bad UUID
#@ pause 5
mount --all
clear

#^ 5. Correct the entry in /etc/fstab
#! Search for zzz and delete its three characters
vim /etc/fstab
/zzz
#@ noenter
#@ pause 5
3x
:wq
clear

#^ 6. Reload systemd and confirm mount --all succeeds
systemctl daemon-reload
#! No output from mount: every entry mounted, /boot included
#! The instructor lab also prints the kernel's XFS Mounting line; the SCC lab does not
#@ pause 5
mount --all
clear

#^ 7. Reboot and confirm a normal boot
#! Two red "Failed to connect to system scope bus" lines are expected; the reboot goes ahead
#@ pause 30
systemctl reboot
#! Detach from the serial console once the login prompt appears
#@ key ctrl+]
ssh servera
#! /boot is mounted again
#@ pause 5
mount | grep /boot

# Complete

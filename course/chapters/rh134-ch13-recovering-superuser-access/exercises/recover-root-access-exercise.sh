kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Recover Root Access
# Requirements
#   Host: servera, with its VM console open
#   Prerequisite exercise: Change Kernel Arguments
#   Lock root out of servera, then get back in by booting with init=/bin/bash
# Steps
#   1. Lock the root account and confirm a console login fails
#   2. Boot once with init=/bin/bash added at the GRUB2 menu
#   3. Remount the root file system read/write
#   4. Reset the root password
#   5. Schedule an SELinux relabel
#   6. Hand control to systemd and wait for the relabel and reboot
#   7. Log in as root at the console
clear

#^ 1. Lock the root account and confirm a console login fails
sudo passwd -l root
#! L: the root password is locked
sudo passwd -S root
#! At the servera console login prompt, try to log in as root with its usual password
#! Login incorrect: the lock works, while student over SSH is unaffected
clear

#^ 2. Boot once with init=/bin/bash added at the GRUB2 menu
#! Bring the servera console window forward before rebooting
sudo systemctl reboot
#! At the menu, press any key except Enter to stop the countdown, then press e
#! Move down to the line that starts with linux and remove any console= options
#! Press End, type a space and init=/bin/bash, then press Ctrl+X to boot
#! A bash-5.2# prompt appears on the console: no login and no password

#^ 3. Remount the root file system read/write
#! At the bash-5.2# prompt on the console, run: mount -o remount,rw /
#! Then run: mount | grep root
#! rw among the options: passwd can now write /etc/shadow

#^ 4. Reset the root password
#! On the console, run: passwd
#! Type root's usual password at both prompts; nothing echoes
#! BAD PASSWORD: The password is shorter than 8 characters is a warning; the change goes through

#^ 5. Schedule an SELinux relabel
#! On the console, run: touch /.autorelabel

#^ 6. Hand control to systemd and wait for the relabel and reboot
#! On the console, run: exec /sbin/init
#! systemd relabels every file, then reboots servera by itself

#^ 7. Log in as root at the console
#! At the servera console login prompt, log in as root with its usual password
#! Wait for servera to finish booting, then reconnect
ssh servera
#! P: root has a password again, and the lock is gone
sudo passwd -S root
clear

#^ Clean up
#! Hide the GRUB2 menu again; Change Kernel Arguments unhid it
sudo -i
grub2-editenv - set menu_auto_hide=1
#@ pause 5
grub2-editenv - list

# Complete

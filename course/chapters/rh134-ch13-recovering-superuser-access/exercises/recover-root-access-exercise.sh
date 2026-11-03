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
#@ pause 5
sudo passwd -S root
#! Students try the root login in the servera VM window
#! Leave SSH and attach to the serial console, where the login prompt is
exit
virsh -c qemu:///system console servera
#! Enter brings up a fresh login prompt
#@ key enter
root
#! Login incorrect: the lock works, while student over SSH is unaffected
#@ pause 5
redhat
#@ key ctrl+]
ssh servera
clear

#^ 2. Boot once with init=/bin/bash added at the GRUB2 menu
#! Students do this step and the rest up to the reconnect in the servera VM window
#! Attach to the serial console straight after the reboot: GRUB2 draws its menu once, under 2 seconds in
#@ pause 0.5
sudo systemctl reboot
#@ noenter
#@ pause 0
virsh -c qemu:///system console servera
#! Press F2 promptly after this: the countdown runs 5 seconds
#@ pause 2
#@ key enter
#! Any key except Enter stops the countdown; up keeps the default entry highlighted
#@ key up
#! e opens the highlighted entry in the editor
#@ key e
#! Three lines down is the line that starts with linux, which wraps onto the next screen lines
#@ key down
#@ key down
#@ key down
#! End jumps to the end of the linux line; leave the console= options there
#@ key end
#! The leading space matters: typed after a comma, init=/bin/bash becomes part of console=ttyS0,115200
#@ noenter
#@ pause 5
 init=/bin/bash
#! A bash-5.2# prompt appears about 3 seconds later: no login and no password
#@ pause 8
#@ key ctrl+x
clear

#^ 3. Remount the root file system read/write
mount -o remount,rw /
#! rw among the options: passwd can now write /etc/shadow
#@ pause 5
mount | grep root
clear

#^ 4. Reset the root password
passwd
#! The new password at New password:; nothing echoes
redhat
#! BAD PASSWORD: The password is shorter than 8 characters is a warning; the change goes through
#@ pause 5
redhat
clear

#^ 5. Schedule an SELinux relabel
touch /.autorelabel
clear

#^ 6. Hand control to systemd and wait for the relabel and reboot
#! systemd relabels every file, then reboots servera by itself
#! No clear after this: the next header lands at the login prompt, where clear would be typed as a user name
#@ pause 30
exec /sbin/init

#^ 7. Log in as root at the console
#! The header's Enter brings up a fresh login prompt
root
#! The new password works; the console also reports the failed attempt from step 1
#@ pause 5
redhat
#! Log out of the console before detaching
exit
#@ key ctrl+]
ssh servera
#! P: root has a password again, and the lock is gone
#@ pause 5
sudo passwd -S root
clear

#^ Clean up
#! Hide the GRUB2 menu again; Change Kernel Arguments unhid it
sudo -i
grub2-editenv - set menu_auto_hide=1
#@ pause 5
grub2-editenv - list

# Complete

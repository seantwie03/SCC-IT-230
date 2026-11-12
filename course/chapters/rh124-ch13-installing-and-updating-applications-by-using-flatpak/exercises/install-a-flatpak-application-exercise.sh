kitten @ action --self change_font_size current 30 && ssh workstation
clear

#@ pause 8
#^ Exercise: Install a Flatpak Application
# Requirements
#   Host: workstation, as student
#   Install a newer Firefox for student alone, without sudo
# Steps
#   1. Check the version of the Firefox RPM
#   2. Add Flathub for yourself only
#   3. Find Firefox's application ID
#   4. Start installing Firefox in your user installation, and leave it running
clear

#^ 1. Check the version of the Firefox RPM
#! 128.8.0: the ESR line RHEL 10 ships; exercise 6 compares it with the Flatpak
rpm -q firefox
clear

#^ 2. Add Flathub for yourself only
#! Only rhel, Red Hat's remote, in the system installation
flatpak remotes
#! --user: student's own installation, so no sudo; it prints nothing
flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
#! flathub user: added for student alone
#@ pause 5
flatpak remotes
clear

#^ 3. Find Firefox's application ID
#! The Firefox row: org.mozilla.firefox, in rhel,flathub; the 153.5.0 is the rhel remote's version, not Flathub's
#@ pause 6
flatpak search firefox
clear

#^ 4. Start installing Firefox in your user installation
#! Naming flathub installs Flathub's Firefox; -y answers every question
#! Seven refs, the runtime among them: 13 seconds on the instructor lab, longer for a class on the VDI
#! Students leave it running and return to the slides; exercise 6 checks that it finished
#@ pause 30
flatpak install --user -y flathub org.mozilla.firefox

# Complete

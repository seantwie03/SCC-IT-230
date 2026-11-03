kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 10
#^ Exercise: Inspect and Remove a Flatpak Application
# Requirements
#   Host: workstation, as student
#   Prerequisite exercise: Install a Flatpak Application
#   Confirm the new Firefox is yours alone, then remove it
# Steps
#   1. Confirm the installation finished
#   2. Compare the Flatpak's version with the RPM's
#   3. Confirm the installation is yours alone
#   4. Launch Firefox from Activities
#   5. Find Firefox in GNOME Software
#   6. Remove Firefox with its data, then its unused runtimes and the remote
clear

#^ 1. Confirm the installation finished
#! Firefox, user in the Installation column; an empty list means the install is still running
#@ pause 5
flatpak list --app
clear

#^ 2. Compare the Flatpak's version with the RPM's
rpm -q firefox
#! Version: 159.0 against the RPM's 128.8.0; Origin: flathub and Installation: user too
#@ pause 6
flatpak info org.mozilla.firefox
clear

#^ 3. Confirm the installation is yours alone
#! Nothing: root sees the system installation and its own, and Firefox is in neither
sudo flatpak list --app
# root sees no Firefox: it is in student's installation only
clear

#^ 4. Launch Firefox from Activities
#! Students do steps 4 and 5 in the workstation VM window; the recording skips them
#! Activities lists two entries named Firefox, the RPM's and the Flatpak's; Help, About Firefox tells them apart

#^ 5. Find Firefox in GNOME Software
#! Software, search Firefox, Flathub as the source: Open and a trash button

#^ 6. Remove Firefox with its data, then its unused runtimes and the remote
#! -y answers the data question too; the recording has no data, since it skipped step 4
#@ pause 6
flatpak uninstall --user -y --delete-data org.mozilla.firefox
#! The five runtime refs only Firefox needed
#@ pause 6
flatpak uninstall --user -y --unused
#! Nothing is installed from flathub now, so it asks nothing
flatpak remote-delete --user flathub
#! rhel alone again; the Firefox RPM is untouched
#@ pause 5
flatpak remotes

# Complete

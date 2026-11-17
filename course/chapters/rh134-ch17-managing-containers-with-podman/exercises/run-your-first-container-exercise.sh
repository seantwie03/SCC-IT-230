kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 8
#^ Exercise: Run Your First Container
# Requirements
#   Host: servera
#   See what a container brings with it and what it shares with its host
# Steps
#   1. Install Podman
#   2. Check the Podman version
#   3. Compare the RHEL release in a UBI 10 container and on servera
#   4. Compare the kernel in a UBI 10 container and on servera
clear

#^ 1. Install Podman
#! RHEL 9's container-tools package does not exist in RHEL 10
#! The install took 23.5 seconds in the first recording; anything typed before it ends is lost
#@ pause 30
sudo dnf install -y podman
clear

#^ 2. Check the Podman version
podman -v
clear

#^ 3. Compare the RHEL release in a UBI 10 container and on servera
#! The first run pulls the image, about 80 MB
#@ pause 8
podman run registry.access.redhat.com/ubi10/ubi cat /etc/redhat-release
cat /etc/redhat-release
#! The container's files come from a newer RHEL release than servera's
clear

#^ 4. Compare the kernel in a UBI 10 container and on servera
podman run registry.access.redhat.com/ubi10/ubi uname -r
#! Same kernel: a container brings its own files, never its own kernel
#@ pause 5
uname -r

# Complete

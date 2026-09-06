kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Changing the Time Zone
# Requirements
#   Host: servera
#   New time zone: Amsterdam
# Tasks
#   1. Record the current configuration
#   2. Find the time zone name Amsterdam uses
#   3. Set the new time zone
#   4. Confirm only the display changed
#   5. Put the original back
clear

#^ 1. Record the current configuration
timedatectl
date
clear

#^ 2. Find the time zone name Amsterdam uses
#! tzselect only tells you the name, it changes nothing
timedatectl list-timezones | grep -i amsterdam
clear

#^ 3. Set the new time zone
sudo timedatectl set-timezone Europe/Amsterdam
clear

#^ 4. Confirm only the display changed
timedatectl
date
date -u
#! Local time moved, universal time did not. The clock never changed.
clear

#^ 5. Put the original back
sudo timedatectl set-timezone Etc/UTC
timedatectl

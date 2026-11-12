kitten @ action --self change_font_size current 30 && ssh workstation
ssh servera
clear

#@ pause 8
#^ Exercise: Changing the Pager and Editor
# Requirements
#   Hosts: workstation, then servera
#   Choose which programs open your manual pages and your text
# Steps
#   1. Confirm that neither PAGER nor EDITOR is set
#   2. Export PAGER so that man prints straight to the terminal
#   3. Install nano and export EDITOR so it opens instead of vi
#   4. Confirm both are gone in a new session
clear

#^ 1. Confirm that neither PAGER nor EDITOR is set
echo "PAGER=[$PAGER]"
echo "EDITOR=[$EDITOR]"
#! Both empty: man falls back to less, editors fall back to vi
clear

#^ 2. Export PAGER so that man prints straight to the terminal
#! Press q to leave less
#@ pause 5
man ls
#@ noenter
q
export PAGER=cat
#! The whole page prints instead of paging
#@ pause 6
man ls
clear

#^ 3. Install nano and export EDITOR so it opens instead of vi
#! nano is not installed by default on RHEL
#@ pause 6
sudo dnf install -y nano
#! crontab -e opens EDITOR, or vi when EDITOR is unset
crontab -e
:q!
export EDITOR=nano
#! Same command, different editor; the next press sends Ctrl+X to leave nano
crontab -e
#@ key ctrl+x
clear

#^ 4. Confirm both are gone in a new session
#! export passes a variable to the programs you launch; it writes nothing to a file
exit
ssh servera
echo "PAGER=[$PAGER]"
echo "EDITOR=[$EDITOR]"

# Complete

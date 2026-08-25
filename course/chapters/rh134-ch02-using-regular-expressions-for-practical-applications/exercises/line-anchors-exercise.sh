kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Anchor a Pattern to the Start or End of a Line
# Requirements
#   Host: servera
# Tasks
#   1. Install the dictionary and search without anchors
#   2. Compare start, end, and exact-line anchors
#   3. Use a start anchor to identify directories
#   4. Use an end anchor to identify configuration files
clear

#^ 1. Install the dictionary and search without anchors
sudo dnf install -y words
ls -l /usr/share/dict/words
grep 'cat' /usr/share/dict/words
clear

#^ 2. Compare start, end, and exact-line anchors
grep '^cat' /usr/share/dict/words
grep 'cat$' /usr/share/dict/words
grep '^cat$' /usr/share/dict/words
clear

#^ 3. Use a start anchor to identify directories
ls -l /etc
clear
ls -l /etc | grep 'd'
clear
ls -l /etc | grep '^d'
clear

#^ 4. Use an end anchor to identify configuration files
#! The dot is a wildcard to grep, so it must be escaped to match a real period.
ls -l /etc | grep '\.conf$'

kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Anchor a Pattern to the Start or End of a Line

#^ Install the system dictionary
#! The words package provides /usr/share/dict/words. Skip this if it is already installed.
sudo dnf install -y words
ls -l /usr/share/dict/words
clear

#^ Search with no anchor at all
#! Every line that contains "cat" anywhere matches, including bobcat and duplicate.
grep 'cat' /usr/share/dict/words
clear

#^ Anchor to the start of the line with ^
#! Sometimes called the shark fin. It matches a position, not a character.
grep '^cat' /usr/share/dict/words
clear

#^ Anchor to the end of the line with $
#! Sometimes called big money.
grep 'cat$' /usr/share/dict/words
clear

#^ Use both anchors together
#! The line must contain exactly this word and nothing else.
grep '^cat$' /usr/share/dict/words
clear

#^ A practical use: reading ls -l
#! The first character of each line is the file type: d, -, or l.
ls -l /etc
clear
#! Without an anchor, 'd' matches any line containing the letter.
ls -l /etc | grep 'd'
clear
#! Anchored to the start, it returns only the directories.
ls -l /etc | grep '^d'
clear

#^ Escape a literal dot at the end of the line
#! The dot is a wildcard to grep, so it must be escaped to match a real period.
ls -l /etc | grep '\.conf$'
clear

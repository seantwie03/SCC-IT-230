kitten @ set-font-size 30.0 && ssh servera
clear
#^ Task: Demonstrate Output Redirection (>) vs Append (>>)

#^ Create a very important file
vim evil_plan.md
i
== Plan for World Domination! ==
1. Make humanity reliant on AI by having students use AI to do their homework
...
13. Poison the training data for all new AIs
...
96. Become the supreme-leader of the world!
jj
:wq

#^ Verify our important work
cat evil_plan.md
clear

#^ Add one last step to the plan
echo "97. Call mom and tell her the good news about world domination" > evil_plan.md

#^ Bask in the glory of the completed plan
cat evil_plan.md

#^ OH NO! The single > OVERWRITES the file!
clear

#^ Time for evil_plan-v2.md. It will be even evil-er!
echo "== Eviler Plan for World Domination! ==" > evil_plan-v2.md
echo "1. Invent a <Top Secret Information Redacted>" >> evil_plan-v2.md
echo "2. Use the <Top Secret Information Redacted> to poison the minds of <Top Secret Information Redacted>" >> evil_plan-v2.md

#^ Bask in the glory of an eviler plan
cat evil_plan-v2.md

#^ The CORRECT way to add to a file: Append (>>)
echo "3. Call mom and tell her the good news about world domination" >> evil_plan-v2.md

#^ Verify the append worked
cat evil_plan-v2.md
clear

#^ Clean up evidence
rm evil_plan.md evil_plan-v2.md

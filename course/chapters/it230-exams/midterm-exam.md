---
layout: section
routeAlias: midterm-exam
topicInfo:
  exercises:
    - title: IT-230 - Midterm Study Guide
      source: ./exercises/midterm-study-guide-exercise.html
---

# Midterm Exam

---
layout: two-cols-header
leftWidth: 58
listSpacing: padded
---

# Midterm Exam

::left::

<Callout type="warning" title="Very Challenging">

Essentially a shortened RHCSA practice exam

</Callout>

- Taken in the <AccentText>SCC Lab</AccentText> on the SCC VDI
- <AccentText>Open "book"</AccentText>: Red Hat Academy website
- <AccentText>Open notes</AccentText>: hand-written or hand-typed only
- <AccentText>Camera ON</AccentText> with face centered in the frame

<Callout type="danger">

No AI, and no other website, material, or resource is allowed

</Callout>

::right::

![Illustration of students struggling with a difficult exam](./assets/difficult-exam-decoration.png)

---
listSpacing: padded
---

# Screenshots Are Your Proof

- The professor cannot access your lab environment
- Every item needs a screenshot that proves it is done
  - Completed and item? Run a command that proves it and take a screenshot
  - Edited a file? Show the edited content

<Callout type="danger">

No screenshot, no credit

</Callout>

---
layout: two-cols-header
leftWidth: 40
listSpacing: padded
---

# Show Your Work

**<AccentText>Work</AccentText>** means your command history

::left::

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ history -c
student@servera:~$ history -w
student@servera:~$ mkdir /tmp/reports
student@servera:~$ history
    1  history -w
    2  mkdir /tmp/reports
    3  history
```

</TerminalWindow>

::right::

- `history -c` clears this shell's history
- `history -w` saves the empty history
- Finish the item, run `history`, and screenshot it
- Every server used during an item

::bottom::

<Callout type="warning" title="Working as root?">

Root keeps its own history, so after `sudo -i` run both commands again and screenshot root's `history` as well

</Callout>

---
layout: exercise
---

# Midterm Study Guide

::goal::

Do well on the Midterm by building notes now

::environment::

**Hosts:** `workstation`, `servera`, and `serverb`

::workflow::

1. Open the <a href="../resources/midterm-study-guide-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Open the Midterm Study Guide in a new tab">Midterm Study Guide</a>
2. Work through every item
3. Write all the steps for each item in your notes
4. Use those notes on the Midterm

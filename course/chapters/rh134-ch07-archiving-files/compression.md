---
layout: section
routeAlias: compression
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "07"
        title: Archiving Files
    rhcsaCertGuide:
      - chapter: "03"
        title: Essential File Management Tools
  exercises:
    - title: Comparing Compression Algorithms Exercise
      source: ./exercises/compression-exercise.html
---

# Compression

## Trading CPU time for disk space

---
layout: center
---

# Compression gives you samller files

## At the cost of CPU time

---

# The Trade

The same `/var/log` archive, kept two ways

<div
  class="grid items-center gap-x-5 gap-y-4 w-full"
  style="grid-template-columns: max-content 1fr max-content" >
  <span>Uncompressed: <code>log-backup.tar</code></span>
  <div
    aria-hidden="true"
    style="width: 100%; height: 2.25rem; border-radius: 0.375rem; background: var(--it230-color-accent-fill)"
  ></div>
  <strong>7.1 MB</strong>
  <span>Compressed: <code>log-backup.tar.gz</code></span>
  <div
    aria-hidden="true"
    style="width: 9.3%; height: 2.25rem; border-radius: 0.375rem; background: var(--it230-color-accent-fill)"
  ></div>
  <strong>677 KB</strong>
</div>


Disk space saved: **<SuccessText>6.4 MB</SuccessText>**

Additional CPU Use is the cost:<DangerText>once to compress, and on every read</DangerText>

<!--
The sizes are the /var/log archive from the previous section, before and after gzip. Plain text logs compress unusually well.
-->

---
layout: center
---

# Is Compression Worth It?

## <DangerText>It depends</DangerText>

<div v-click>

How often will the data be read?

</div>

<div v-click>

What kind of data is it?

</div>

<div v-click>

Which algorithm are you using?

</div>

<div v-click>

How much storage do you have?

</div>

<div v-click>

How busy is the CPU?

</div>


<!--
The last question is from RHA chapter 7 section 1: data that is already compressed, such as images or RPM packages, barely shrinks whichever algorithm you use.
-->

---

# Three Compressors, One Option Each

Add one letter to the `tar` options you already know

| Option | Algorithm | Extension | Character                                                      |
|:------:|-----------|-----------|----------------------------------------------------------------|
|  `-z`  | gzip      | `.gz`     | Old faithful, installed nearly everywhere                      |
|  `-j`  | bzip2     | `.bz2`    | Smaller than gzip, more CPU; often missing on minimal installs |
|  `-J`  | xz        | `.xz`     | Smallest of the three, and the most CPU                        |

<Callout type="warning">

`-j` and `-J` are different options: lowercase is bzip2, uppercase is xz

</Callout>

---
layout: center
---

# Creating a Compressed Archive

<TextExplainer
  size="md"
  :lines="['tar -czvf /tmp/log-backup.tar.gz /var/log']"
  :steps="[
    { line: 1, text: '-c', explanation: 'Create' },
    { line: 1, text: 'z', occurrence: 1, explanation: 'gzip compression algorithm' },
    { line: 1, text: 'v', occurrence: 1, explanation: 'Verbose' },
    { line: 1, text: 'f /tmp/log-backup.tar', explanation: 'File: the next argument names the archive' },
    { line: 1, text: '.gz', explanation: 'gzip extension, tar does not add the extension for you' },
    { line: 1, text: '/var/log', explanation: 'files to compress' },
  ]"
/>

---

# Comparing the Results

<TerminalWindow title="root@servera:~" :rows="6">

````md magic-move
```bash-session
root@servera:~# ls -lh --sort=size /tmp/log-backup.tar*
```
```bash-session
root@servera:~# ls -lh --sort=size /tmp/log-backup.tar*
-rw-r--r--. 1 root root 7.1M Sep 17 11:01 /tmp/log-backup.tar
-rw-r--r--. 1 root root 677K Sep 17 11:01 /tmp/log-backup.tar.gz
-rw-r--r--. 1 root root 506K Sep 17 11:01 /tmp/log-backup.tar.bz2
-rw-r--r--. 1 root root 329K Sep 17 11:01 /tmp/log-backup.tar.xz
root@servera:~#
```
````

</TerminalWindow>

<!--
bzip2 is not installed on the lab hosts; the .bz2 archive needed dnf install bzip2 first.
-->

---
vertical: center
---

# Extracting Is Simpler Than Creating

`tar` inspects the file and picks the right decompressor itself

<TerminalWindow title="root@servera:/tmp/log-xz">

```bash-session
root@servera:/tmp/log-xz# tar -xf /tmp/log-backup.tar.xz
root@servera:/tmp/log-xz#
```

</TerminalWindow>

<Callout>

No `-J` needed

</Callout>

---

# Checking a Compressed Archive

`gzip` and `xz` report the ratio with `-l`

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# gzip -l /tmp/log-backup.tar.gz
         compressed        uncompressed  ratio uncompressed_name
             692689             7352320  90.6% /tmp/log-backup.tar
root@servera:~# xz -l /tmp/log-backup.tar.xz
Strms  Blocks   Compressed Uncompressed  Ratio  Check   Filename
    1       1    328.6 KiB  7,180.0 KiB  0.046  CRC64   /tmp/log-backup.tar.xz
```

</TerminalWindow>

See how much disk space will be used by decompressing

<!--
bzip2 has no -l option; it answers "Bad flag".
-->

---
layout: exercise
---

# Comparing Compression Algorithms

::goal::

Find which compressor makes the smallest `/etc` backup, and at what cost

::environment::

**Host:** `servera`

**Prerequisite exercise:** Creating and Extracting Archives

::workflow::

1. Bundle `/etc` three more times, once with each of the three compressors
2. Install whichever compression package is missing before you reach for it
3. List all four archives together, sorted so the sizes are easy to compare
4. Ask `gzip` and `xz` to report the compression ratio of their own archives
5. Extract one of the compressed archives without naming its algorithm
6. Note which archive was smallest and which took longest to create

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/compression-exercise.cast?url";
</script>

# Comparing Compression Algorithms

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor timing tar builds of the /etc backup with gzip, then bzip2 after installing it with dnf, then xz, listing all four archives sorted by size to show that xz is smallest and slowest, reading the ratios with gzip -l and xz -l, extracting the xz archive without naming the algorithm, and cleaning up."
/>

::resources::

<a href="../resources/compression-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Comparing Compression Algorithms exercise in a new tab">Written exercise</a>

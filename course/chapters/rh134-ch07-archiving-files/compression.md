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

# Compression buys smaller files.

## It pays for them in CPU time.

---
layout: two-cols-header
vertical: start
---

# The Trade

::left::

## Uncompressed

**41 MB on disk**

<SuccessText>Costs almost no CPU to read.</SuccessText>

<DangerText>Takes the most space.</DangerText>

::right::

## Compressed

**9 MB on disk**

<SuccessText>Saves 32 MB.</SuccessText>

<DangerText>Costs CPU once to compress — and again every time anyone reads it.</DangerText>

---
layout: center
---

# Is Compression Worth It?

## <DangerText>It depends.</DangerText>

- Which algorithm are you using?
- How much spare CPU does the server have?
- How much storage do you actually have left?
- How often will the file be read?

---
vertical: start
---

# Three Compressors, One Option Each

Add one letter to the `tar` options you already know.

| Option | Algorithm | Extension | Character                                                  |
| :----: | --------- | --------- | ---------------------------------------------------------- |
|  `-z`  | gzip      | `.gz`     | Old faithful — installed nearly everywhere                 |
|  `-j`  | bzip2     | `.bz2`    | Smaller than gzip, more CPU; often missing on minimal installs |
|  `-J`  | xz        | `.xz`     | Smallest of the three, and the most CPU                    |

<Callout type="warning">

`-j` and `-J` are different options. Lowercase is bzip2; uppercase is xz.

</Callout>

---
vertical: center
---

# Creating a Compressed Archive

<CommandExplainer
  command="tar -czvf /tmp/etc-backup.tar.gz /etc"
  :steps="[
    { active: '-c', explanation: 'create — the same operation as before' },
    { active: 'z', occurrence: 1, explanation: 'Run the result through gzip' },
    { active: 'v', explanation: 'verbose' },
    { active: 'f', explanation: 'file — the archive to write' },
    { active: '.gz', explanation: 'Name the file for what it holds. tar will not add the extension for you.' },
  ]"
/>

---
vertical: start
---

# Comparing the Results

<TerminalWindow title="root@servera:~">

````md magic-move
```bash-session
root@servera:~# ls -lh --sort=size /tmp/etc-backup.tar*
```
```bash-session
root@servera:~# ls -lh --sort=size /tmp/etc-backup.tar*
-rw-r--r--. 1 root root  41M Jan  6 13:04 /tmp/etc-backup.tar
-rw-r--r--. 1 root root 9.4M Jan  6 13:06 /tmp/etc-backup.tar.gz
-rw-r--r--. 1 root root 8.6M Jan  6 13:08 /tmp/etc-backup.tar.bz2
-rw-r--r--. 1 root root 6.7M Jan  6 13:11 /tmp/etc-backup.tar.xz
root@servera:~#
```
````

</TerminalWindow>

<v-click>

Same content every time. The only thing that changed is how long each one took to build.

</v-click>

---
vertical: center
---

# Extracting Is Simpler Than Creating

`tar` inspects the file and picks the right decompressor itself.

<TerminalWindow title="root@servera:/tmp/etc-extract">

```bash-session
root@servera:/tmp/etc-extract# tar -xf /tmp/etc-backup.tar.xz
root@servera:/tmp/etc-extract#
```

</TerminalWindow>

<Callout>

No `-J` needed. The same `tar -xf` extracts all four archives.

</Callout>

---
vertical: start
---

# Checking a Compressed Archive

Each compressor ships a tool that reports the ratio without unpacking anything.

<TerminalWindow title="root@servera:~">

````md magic-move
```bash-session
root@servera:~# gzip -l /tmp/etc-backup.tar.gz
```
```bash-session
root@servera:~# gzip -l /tmp/etc-backup.tar.gz
         compressed        uncompressed  ratio uncompressed_name
            9853184            42967040  77.1% /tmp/etc-backup.tar
root@servera:~#
```
```bash-session
root@servera:~# gzip -l /tmp/etc-backup.tar.gz
         compressed        uncompressed  ratio uncompressed_name
            9853184            42967040  77.1% /tmp/etc-backup.tar
root@servera:~# xz -l /tmp/etc-backup.tar.xz
```
```bash-session
root@servera:~# gzip -l /tmp/etc-backup.tar.gz
         compressed        uncompressed  ratio uncompressed_name
            9853184            42967040  77.1% /tmp/etc-backup.tar
root@servera:~# xz -l /tmp/etc-backup.tar.xz
Strms  Blocks   Compressed Uncompressed  Ratio  Check   Filename
    1       1      6.7 MiB     41.0 MiB  0.163  CRC64   /tmp/etc-backup.tar.xz
root@servera:~#
```
````

</TerminalWindow>

---

# Exercise: Comparing Compression Algorithms

## Requirements

Host: `servera`, as `root`

`bzip2` is not part of a minimal installation. Confirm it is available before you use it.

## Steps

1. Bundle `/etc` three more times, once with each of the three compressors
2. Install whichever compression package is missing before you reach for it
3. List all four archives together, sorted so the sizes are easy to compare
4. Ask `gzip` and `xz` to report the compression ratio of their own archives
5. Extract one of the compressed archives without naming its algorithm
6. Note which archive was smallest and which took longest to create

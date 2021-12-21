# Introduction

Mixamo Batcher allows you to create and save animation packs, and download them as an archive file

# Known Limitations

- Need to be logged in
- [Max zip size of 2gb](https://chromium.googlesource.com/chromium/src/+/HEAD/storage/browser/blob/README.md#blob-storage-limits)
- Data is saved in browser localStorage. Uninstalling the extension or clearing extension data will result in data loss.
- Selecting an animation from a pack may load up more than one page of animations. If the target animation is not on the first page it won't be selected.

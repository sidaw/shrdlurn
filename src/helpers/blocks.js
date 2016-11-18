export function sortBlocks(blocks) {
  return blocks.sort((a, b) => {
    if (a.z > b.z) {
      return 1;
    } else if (a.z < b.z) {
      return -1;
    }

    if (a.x > b.x) {
      return -1;
    } else if (a.x < b.x) {
      return 1;
    }

    if (a.y > b.y) {
      return -1;
    } else if (a.y < b.y) {
      return 1;
    }

    return 0;
  });
}

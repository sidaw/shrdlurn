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

export function blocksEqual(struct1, struct2) {
  const a = sortBlocks(struct1);
  const b = sortBlocks(struct2);

  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i].x !== b[i].x ||
        a[i].y !== b[i].y ||
        a[i].z !== b[i].z ||
        a[i].color !== b[i].color ||
        a[i].names !== b[i].names) {
      return false;
    }
  }

  return true;
}

export function rotateBlock (b, rotational, width = 1) {
	let x = b.x;
	let y = b.y;
	switch (rotational) {
		case -1:
			x = b.x;
			y = b.y;
			break;
		case -2:
			x = b.y;
			y = width - 1 - b.x;
			break;
		case 1:
			x = width - 1 - b.y;
			y = b.x;
			break;
		case 2:
			x = width - 1 - b.x;
			y = width - 1 - b.y;
			break;
		default:
	}
	return { ...b, x: x, y: y };
}

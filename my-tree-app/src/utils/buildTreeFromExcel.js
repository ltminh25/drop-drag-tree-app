import slugify from "slugify";
function buildTreeFromExcel(rows) {
  const items = {
    root: { index: "root", data: "Root", isFolder: true, children: [] }
  };

  rows.forEach(row => {
    const levels = [row.C1, row.C2, row.C3, row.C4].filter(Boolean);
    let parentIndex = "root";

    levels.forEach((cell, i) => {
      const index = slugify(levels.slice(0, i + 1).join(" "), { lower: true, strict: true });
      if (!items[index]) {
        items[index] = {
          index,
          data: cell,
          isFolder: i < levels.length - 1,
          children: [],
        };
      }

      if (!items[parentIndex].children.includes(index)) {
        items[parentIndex].children.push(index);
      }

      parentIndex = index;
    });
  });

  return Object.values(items);
}
export default buildTreeFromExcel;
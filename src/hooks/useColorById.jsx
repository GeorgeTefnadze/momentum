const departmentColors = [
  "mainpurple",
  "mainyellow",
  "mainorange",
  "mainpink",
  "mainblue",
  "maingreen",
  "mainred",
];

const statusColors = ["mainyellow", "mainorange", "mainpink", "mainblue"];

const priorityColors = ["maingreen", "mainyellow", "mainred"];

const useColorById = (identifyer, id, prefix) => {
  if (identifyer == "department") {
    if (id !== undefined && id !== null) {
      const index = (parseInt(id, 10) - 1) % departmentColors.length;
      return `${prefix}-${
        departmentColors[index >= 0 ? index : departmentColors.length - 1]
      }`;
    }
    return departmentColors[0];
  } else if (identifyer == "status") {
    if (id !== undefined && id !== null) {
      const index = (parseInt(id, 10) - 1) % statusColors.length;
      return `${prefix}-${
        statusColors[index >= 0 ? index : statusColors.length - 1]
      }`;
    }
    return `${prefix}-${statusColors[0]}`;
  } else if (identifyer == "priority") {
    if (id !== undefined && id !== null) {
      const index = (parseInt(id, 10) - 1) % priorityColors.length;
      return `${prefix}-${
        priorityColors[index >= 0 ? index : priorityColors.length - 1]
      }`;
    }
  }
};

export default useColorById;

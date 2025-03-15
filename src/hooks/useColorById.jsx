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

const useColorById = (identifyer, id) => {
  if (identifyer == "department") {
    if (id !== undefined && id !== null) {
      const index = (parseInt(id, 10) - 1) % departmentColors.length;
      return departmentColors[index >= 0 ? index : departmentColors.length - 1];
    }
    return departmentColors[0];
  } else if (identifyer == "status") {
    if (id !== undefined && id !== null) {
      const index = (parseInt(id, 10) - 1) % statusColors.length;
      return statusColors[index >= 0 ? index : statusColors.length - 1];
    }
    return statusColors[0];
  }
};

export default useColorById;

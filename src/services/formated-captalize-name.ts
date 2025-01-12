export const capitalizeName = (name: string) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .slice(0, 1) // Mantém apenas o primeiro e o segundo nome
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

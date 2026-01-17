export const generateIdentifier = (name: string) => {
  return name
    .replace(/[^a-zA-Z]/g, "") // remove spaces & symbols
    .toUpperCase()
    .slice(0, 4);
};

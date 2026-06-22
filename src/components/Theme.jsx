export function getTheme() {
  const settings = JSON.parse(
    localStorage.getItem("layoutSettings") || "{}"
  );

  return settings.theme || "dark";
}

export function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
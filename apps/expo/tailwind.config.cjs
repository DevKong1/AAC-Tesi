/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@acme/tailwind-config")],
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      background: "#FFEEEB",
      text: "#5C5C5C",
      games: "#C6D7F9",
      reading: "#B9D2C3",
      talking: "#EBDBD8",
      purpleCard: "#D9D9FD",
      yellowCard: "#FFFFCA",
      aquamarineCard: "#8ABFCF",
      play: "#89BF93",
      yes: "#89BF93",
      no: "#F69898",
      refresh: "#E49691",
      list: "#A3B0B4",
    },
    fontFamily: {
      text: "Kreon",
      logo: "Montserrat",
    },
  },
};

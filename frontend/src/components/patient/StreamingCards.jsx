import React from "react";

const services = [
  {
    name: "Netflix",
    url: "https://www.netflix.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    bg: "bg-black",
  },
  {
    name: "Prime Video",
    url: "https://www.primevideo.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
    bg: "bg-white",
  },
  {
    name: "Crunchyroll",
    url: "https://www.crunchyroll.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Crunchyroll_Logo.svg",
    bg: "bg-white",
  },
  {
    name: "HBO",
    url: "https://www.hbomax.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
    bg: "bg-black",
  },
];

export default function StreamingCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
      {services.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${s.name} in a new tab`}
          title={s.name}
          className={`flex items-center justify-center aspect-square rounded-xl ${s.bg} shadow-md transition hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-400`}
        >
          <img
            src={s.logo}
            alt={`${s.name} logo`}
            className="w-16 h-auto"
          />
        </a>
      ))}
    </div>
  );
}

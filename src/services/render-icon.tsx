import { Book, Coins, NotepadText, Puzzle, Rocket, User } from "lucide-react";

export function renderIcon(
  pasta:
    | "FINANCAS"
    | "FICHAS"
    | "POS"
    | "MONTAGEM"
    | "PALESTRA"
    | "PADRE"
    | "PAROQUIA"
) {
  const iconClass = "text-[#B8B8B8] h-6 w-6";
  const containerClass = "bg-[#171618] p-3 rounded-lg flex items-center justify-center";

  switch (pasta) {
    case "FINANCAS":
      return (
        <div className={containerClass}>
          <Coins className={iconClass} />
        </div>
      );
    case "FICHAS":
      return (
        <div className={containerClass}>
          <NotepadText className={iconClass} />
        </div>
      );
    case "POS":
      return (
        <div className={containerClass}>
          <Rocket className={iconClass} />
        </div>
      );
    case "MONTAGEM":
      return (
        <div className={containerClass}>
          <Puzzle className={iconClass} />
        </div>
      );
    case "PALESTRA":
      return (
        <div className={containerClass}>
          <Book className={iconClass} />
        </div>
      );
    case "PADRE":
      return (
        <div className={containerClass}>
          <User className={iconClass} />
        </div>
      );
    default:
      return (
        <div className={containerClass}>
          <User className={iconClass} />
        </div>
      );
  }
}

import { renderToStaticMarkup } from "react-dom/server";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Box,
  Zap,
  Heart,
  Star,
  Coffee,
  Music,
  Camera,
  Shield,
  Crown,
  Rocket,
  Target,
  Trophy,
  Flag,
  Gift,
  Bell,
  Clock,
  Mail,
  Phone,
  Home,
  User,
  Users,
  Search,
  Settings,
  Lock,
  Archive,
  Bookmark,
  Calendar,
  Code,
  Database,
  Download,
  Eye,
  FileIcon,
  Filter,
  Folder,
  Grid,
  Hash,
  Image,
  Laptop,
  Link,
  List,
  Map,
  Menu,
  Paperclip,
  Play,
  Save,
  Send,
  Share,
  Trash,
  Upload,
  Wifi,
  Package,
  Briefcase,
  Cloud,
  Compass,
  Cpu,
  CreditCard,
  Disc,
  DollarSign,
  Feather,
  Film,
  Folder as Globe,
  Headphones,
  Inbox,
  Layers,
  Layout,
  MessageSquare,
  Mic,
  Monitor,
  Moon,
  Mountain,
  Navigation,
  Percent,
  Printer,
  Radio,
  Server,
  ShoppingCart,
  Smartphone,
  Speaker,
  Sun,
  Tag,
  Terminal,
  Thermometer,
  Truck,
  Tv,
  Umbrella,
  Video,
  Volume2,
  Watch,
  Wrench,
  XCircle,
  AlertCircle,
  Activity,
  Anchor,
  Aperture,
  Award,
  BarChart,
  Battery,
  Bluetooth,
  Book,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COLOR_OPTIONS = [
  { name: "Gray", value: "text-gray-500" },
  { name: "Slate", value: "text-slate-500" },
  { name: "Blue", value: "text-blue-500" },
  { name: "Cyan", value: "text-cyan-500" },
  { name: "Green", value: "text-green-500" },
  { name: "Yellow", value: "text-yellow-500" },
  { name: "Orange", value: "text-orange-500" },
  { name: "Rose", value: "text-rose-400" },
  { name: "Red", value: "text-red-500" },
  {
    name: "Rainbow",
    value: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500",
  },
];

const ICONS = [
  { name: "box", icon: Box },
  { name: "zap", icon: Zap },
  { name: "heart", icon: Heart },
  { name: "star", icon: Star },
  { name: "coffee", icon: Coffee },
  { name: "music", icon: Music },
  { name: "camera", icon: Camera },
  { name: "shield", icon: Shield },
  { name: "crown", icon: Crown },
  { name: "rocket", icon: Rocket },
  { name: "target", icon: Target },
  { name: "trophy", icon: Trophy },
  { name: "flag", icon: Flag },
  { name: "gift", icon: Gift },
  { name: "bell", icon: Bell },
  { name: "clock", icon: Clock },
  { name: "mail", icon: Mail },
  { name: "phone", icon: Phone },
  { name: "home", icon: Home },
  { name: "user", icon: User },
  { name: "users", icon: Users },
  { name: "search", icon: Search },
  { name: "settings", icon: Settings },
  { name: "lock", icon: Lock },
  { name: "archive", icon: Archive },
  { name: "bookmark", icon: Bookmark },
  { name: "calendar", icon: Calendar },
  { name: "code", icon: Code },
  { name: "database", icon: Database },
  { name: "download", icon: Download },
  { name: "eye", icon: Eye },
  { name: "file", icon: FileIcon },
  { name: "filter", icon: Filter },
  { name: "folder", icon: Folder },
  { name: "grid", icon: Grid },
  { name: "hash", icon: Hash },
  { name: "image", icon: Image },
  { name: "laptop", icon: Laptop },
  { name: "link", icon: Link },
  { name: "list", icon: List },
  { name: "map", icon: Map },
  { name: "menu", icon: Menu },
  { name: "paperclip", icon: Paperclip },
  //   { name: "pie", icon: Pie },
  { name: "play", icon: Play },
  { name: "save", icon: Save },
  { name: "send", icon: Send },
  { name: "share", icon: Share },
  { name: "trash", icon: Trash },
  { name: "upload", icon: Upload },
  { name: "wifi", icon: Wifi },
  //   { name: "tool", icon: Tool },
  { name: "package", icon: Package },
  { name: "briefcase", icon: Briefcase },
  { name: "cloud", icon: Cloud },
  { name: "compass", icon: Compass },
  { name: "cpu", icon: Cpu },
  { name: "credit-card", icon: CreditCard },
  { name: "disc", icon: Disc },
  { name: "dollar", icon: DollarSign },
  { name: "feather", icon: Feather },
  { name: "film", icon: Film },
  { name: "globe", icon: Globe },
  { name: "headphones", icon: Headphones },
  { name: "inbox", icon: Inbox },
  { name: "layers", icon: Layers },
  { name: "layout", icon: Layout },
  { name: "message", icon: MessageSquare },
  { name: "mic", icon: Mic },
  { name: "monitor", icon: Monitor },
  { name: "moon", icon: Moon },
  { name: "mountain", icon: Mountain },
  { name: "navigation", icon: Navigation },
  { name: "percent", icon: Percent },
  { name: "printer", icon: Printer },
  { name: "radio", icon: Radio },
  { name: "server", icon: Server },
  { name: "cart", icon: ShoppingCart },
  { name: "smartphone", icon: Smartphone },
  { name: "speaker", icon: Speaker },
  { name: "sun", icon: Sun },
  { name: "tag", icon: Tag },
  { name: "terminal", icon: Terminal },
  { name: "thermometer", icon: Thermometer },
  { name: "truck", icon: Truck },
  { name: "tv", icon: Tv },
  { name: "umbrella", icon: Umbrella },
  { name: "video", icon: Video },
  { name: "volume", icon: Volume2 },
  { name: "watch", icon: Watch },
  { name: "wrench", icon: Wrench },
  { name: "x-circle", icon: XCircle },
  { name: "alert", icon: AlertCircle },
  { name: "activity", icon: Activity },
  { name: "anchor", icon: Anchor },
  { name: "aperture", icon: Aperture },
  { name: "award", icon: Award },
  { name: "bar-chart", icon: BarChart },
  { name: "battery", icon: Battery },
  { name: "bluetooth", icon: Bluetooth },
  { name: "book", icon: Book },
];

const EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😚",
  "😙",
  "🥲",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "🤥",
  "😌",
  "😔",
  "😪",
  "🤤",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
  "🏆",
  "🥇",
  "🥈",
  "🥉",
  "⚽",
  "🏀",
  "🏈",
  "⚾",
  "🥎",
  "🎾",
  "🏐",
  "🏉",
  "🥏",
  "🎱",
  "🪀",
  "🏓",
  "🔥",
  "⭐",
  "✨",
  "💫",
  "🌟",
  "💥",
  "💯",
  "✅",
  "❌",
  "⚠️",
  "🚀",
  "🛸",
  "🌙",
  "☀️",
  "⛅",
  "🌈",
  "☔",
  "❄️",
  "⛄",
  "💧",
  "🌍",
  "🌎",
  "🌏",
  "🗺️",
  "🏔️",
  "⛰️",
  "🌋",
  "🏕️",
  "🏖️",
  "🏝️",
];

type IconPickerVariant = "full" | "compact" | "inline";

interface IconPickerProps {
  value?: { icon: string; color: string; type: "icon" | "emoji" | "image" };
  onChange?: (value: {
    icon: string;
    color: string;
    type: "icon" | "emoji";
    file: File;
  }) => void;
  variant?: IconPickerVariant;
  className?: string;
  /** Size of the icon/emoji in pixels (default: 24 for icons, 28 for emojis) */
  size?: number;
}

export function IconPicker({ value, onChange, variant = "full", className, size }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    value?.color || "text-gray-500"
  );
  const [activeTab, setActiveTab] = useState<"icons" | "emojis">("icons");

  const filteredIcons = ICONS.filter((icon) =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEmojis = EMOJIS.filter((emoji) => emoji.includes(search));

  const handleSelectIcon = useCallback(
    (iconName: string) => {
      const IconComponent = ICONS.find((i) => i.name === iconName)?.icon || Box;
      const svgString = renderToStaticMarkup(
        <IconComponent className={cn("h-6 w-6", selectedColor)} />
      );
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const file = new File([blob], "icon.svg", {
        type: blob.type,
        lastModified: Date.now(), // Use the current time or a specific timestamp
      });
      onChange?.({ icon: iconName, color: selectedColor, type: "icon", file });
      setOpen(false);
    },
    [onChange, selectedColor]
  );

  const handleSelectEmoji = (emoji: string) => {
    const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y="1em" font-size="80">${emoji}</text>
</svg>`;

    // To download as a file:
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const file = new File([blob], "icon.svg", {
      type: blob.type,
      lastModified: Date.now(), // Use the current time or a specific timestamp
    });
    onChange?.({ icon: emoji, color: "", type: "emoji", file });
    setOpen(false);
  };

  const renderSelectedIcon = () => {
    const iconSize = size ? `${size}px` : undefined;

    if (!value) {
      return (
        <Box
          className="text-muted-foreground"
          style={iconSize ? { width: iconSize, height: iconSize } : { width: 24, height: 24 }}
        />
      );
    }

    if (value.type === "emoji") {
      return (
        <span style={iconSize ? { fontSize: iconSize } : { fontSize: '1.75rem' }}>
          {value.icon}
        </span>
      );
    }

    const IconComponent = ICONS.find((i) => i.name === value.icon)?.icon || Box;
    return (
      <IconComponent
        className={value.color}
        style={iconSize ? { width: iconSize, height: iconSize } : { width: 20, height: 20 }}
      />
    );
  };

  useEffect(() => {
    if (!value) {
      handleSelectIcon("box");
    }
  }, [value, handleSelectIcon]);

  // Inline variant - just displays the icon, non-clickable
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        {renderSelectedIcon()}
      </div>
    );
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant={variant === "compact" ? "ghost" : "outline"}
            className={cn(
              "h-10 w-10 p-0 rounded-md cursor-pointer",
              variant === "full" && "shadow-sm",
              variant === "compact" && "border-0 shadow-none",
              className
            )}
          >
            {renderSelectedIcon()}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[600px] p-0 rounded-xl shadow-lg border bg-background"
          align="start"
        >
          {/* Tabs Header */}
          <div className="px-6 pt-4">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "icons" | "emojis")}
            >
              <TabsList className="h-10 mb-2 justify-start bg-transparent">
                <TabsTrigger
                  value="icons"
                  className="relative px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none
            data-[state=active]:before:content-[''] data-[state=active]:before:absolute data-[state=active]:before:bottom-0
            data-[state=active]:before:left-0 data-[state=active]:before:right-0 data-[state=active]:before:h-[2px]
            data-[state=active]:before:bg-blue-800"
                >
                  Icons
                </TabsTrigger>

                <TabsTrigger
                  value="emojis"
                  className="relative px-4 py-2 text-sm font-medium rounded-none
            data-[state=active]:text-primary data-[state=active]:shadow-none
            data-[state=active]:before:content-[''] data-[state=active]:before:absolute data-[state=active]:before:bottom-0
            data-[state=active]:before:left-0 data-[state=active]:before:right-0 data-[state=active]:before:h-[2px]
            data-[state=active]:before:bg-blue-800"
                >
                  Emojis
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Body */}
          <div className="px-6 pb-4 pt-1">
            {/* Color Picker */}
            {activeTab === "icons" && (
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      "w-7 h-7 rounded-full border border-transparent hover:opacity-90 transition-all",
                      color.value ===
                        "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
                        ? color.value
                        : `bg-current ${color.value}`,
                      selectedColor === color.value &&
                        "ring-2 ring-primary ring-offset-2"
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            )}

            {/* Search */}
            <Input
              placeholder={
                activeTab === "icons" ? "Search icons..." : "Search emojis..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 h-9 placeholder:text-sm"
            />

            {/* Grid Container */}
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {/* Icons Grid */}
              {activeTab === "icons" && (
                <div className="grid grid-cols-10 gap-1.5 pb-1">
                  {filteredIcons.map((icon) => {
                    const IconComponent = icon.icon;
                    return (
                      <button
                        key={icon.name}
                        onClick={() => handleSelectIcon(icon.name)}
                        className="h-8 w-8 flex items-center justify-center hover:bg-muted/70 rounded-md transition-colors group"
                        title={icon.name}
                      >
                        <IconComponent
                          className={cn("h-5 w-5", selectedColor)}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Emojis Grid */}
              {activeTab === "emojis" && (
                <div className="grid grid-cols-10 gap-1.5 pb-1">
                  {filteredEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectEmoji(emoji)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-muted/70 rounded-md transition-colors text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

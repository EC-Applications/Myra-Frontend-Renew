
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Clock, Box } from "lucide-react"

interface LeadPopoverProps {
    email: string
    name: string
    role: string
    online?: boolean
    avatar?: string
}

export const LeadPopover = ({
    email,
    name,
    role,
    online = true,
    avatar,
}: LeadPopoverProps) => {
    return (
        <HoverCard openDelay={150}>
            <HoverCardTrigger asChild>
                <Avatar className="w-6 h-6 cursor-pointer">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="text-xs">
                        {name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </HoverCardTrigger>

            <HoverCardContent
                side="right"
                align="start"
                className="w-80 rounded-xl border border-white/10 bg-neutral-900 text-white shadow-xl"
            >
                <div className="flex gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={avatar} />
                       <AvatarFallback className="text-xs">
  {name?.charAt(0) ?? "?"}
</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">{email}</p>
                            {online && (
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                            )}
                        </div>

                        <p className="text-sm text-neutral-400">
                            {name} · <span className="text-neutral-300">{role}</span>
                        </p>

                        <div className="mt-3 space-y-2 text-sm text-neutral-300">
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>10:48 local time</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Box size={14} />
                                <span>daw · Development</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Box size={14} />
                                <span>adwa +1 more</span>
                            </div>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

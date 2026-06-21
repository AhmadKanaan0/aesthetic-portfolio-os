"use client"

import { SoundSettings } from "./sound-settings"
import { ModeToggle } from "./mode-toggle"

export function MobileSettingsBar() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="liquidGlass-wrapper rounded-2xl">
                <div className="liquidGlass-effect"></div>
                <div className="liquidGlass-tint"></div>
                <div className="liquidGlass-shine"></div>
                <div className="liquidGlass-content">
                    <div className="mobile-settings-inner">
                        <SoundSettings />
                        <div className="w-px h-8 bg-white/30" /> {/* Divider */}
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client";

import { useEffect } from "react";
import ChannelService from "@/components/channelTalk";

export function ChannelTalkProvider() {
  const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY;

  useEffect(() => {
    if (!pluginKey) {
      return;
    }

    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey,
      profile: {
        role: "VISITOR",
      },
    });

    return () => {
      ChannelService.shutdown();
    };
  }, [pluginKey]);

  return null;
}

"use client";

import { useEffect } from "react";
import ChannelService from "../channelTalk";

export function ChannelTalkProvider() {
  const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY;

  useEffect(() => {
    if (!pluginKey) {
      return;
    }

    ChannelService.loadScript();
    ChannelService.boot({ pluginKey });

    return () => {
      ChannelService.shutdown();
    };
  }, []);

  return null;
}

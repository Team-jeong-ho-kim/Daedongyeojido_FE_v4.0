"use client";

import { useEffect } from "react";
import { getSessionUser } from "utils";
import ChannelService from "@/components/channelTalk";

export function ChannelTalkProvider() {
  const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY;

  useEffect(() => {
    if (!pluginKey) {
      return;
    }

    const sessionUser = getSessionUser();

    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey,
      memberId: sessionUser?.userName,
      profile: {
        name: sessionUser?.userName,
        role: sessionUser?.role ?? "TEACHER",
      },
    });

    return () => {
      ChannelService.shutdown();
    };
  }, [pluginKey]);

  return null;
}

#!/usr/bin/env node

import { execFileSync, spawn } from "node:child_process";
import process from "node:process";

const DISCORD_EMBED_COLORS = {
  cancelled: 9807270,
  failure: 15158332,
  success: 3447003,
};

const usage = () => {
  console.error(
    "Usage: node scripts/deploy-with-discord.mjs <app-name> <output-dir> [wrangler args...]",
  );
};

const args = process.argv.slice(2);

if (args.length < 2) {
  usage();
  process.exit(1);
}

const [appName, outputDir, ...wranglerArgs] = args;
const combinedOutput = [];

const appendOutput = (chunk) => {
  combinedOutput.push(chunk.toString());
};

const getGitValue = (commandArgs) => {
  try {
    return execFileSync("git", commandArgs, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
};

const extractPagesUrl = (output) => {
  const urls = [...output.matchAll(/https:\/\/[^\s)"']+/g)].map(
    (match) => match[0],
  );

  return (
    urls.find((url) => url.includes(".pages.dev")) ??
    urls.find((url) => url.includes("dash.cloudflare.com")) ??
    urls.at(-1) ??
    null
  );
};

const sendDiscordNotification = async ({ result, output }) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("DISCORD_WEBHOOK_URL is not set. Skipping deploy notification.");
    return;
  }

  const branchName =
    process.env.GITHUB_REF_NAME || getGitValue(["rev-parse", "--abbrev-ref", "HEAD"]);
  const commitSha =
    process.env.GITHUB_SHA || getGitValue(["rev-parse", "--short", "HEAD"]);
  const actor =
    process.env.GITHUB_ACTOR || process.env.USER || process.env.USERNAME || "unknown";
  const deploymentUrl = extractPagesUrl(output);
  const title =
    result === "success" ? "✅ 배포 성공" : result === "failure" ? "❌ 배포 실패" : "⚪ 배포 취소";
  const description =
    result === "success"
      ? `${appName} 배포가 성공적으로 완료되었습니다.`
      : `${appName} 배포가 실패했습니다.`;

  const fields = [
    { name: "App", value: appName, inline: true },
    { name: "Branch", value: branchName, inline: true },
    { name: "Commit", value: commitSha, inline: true },
    { name: "Directory", value: `\`${process.cwd()}\``, inline: false },
  ];

  if (deploymentUrl) {
    fields.push({
      name: "Deployment",
      value: `[Open deployment](${deploymentUrl})`,
      inline: false,
    });
  }

  const payload = {
    username: "CI/CD Alert Bot",
    embeds: [
      {
        title,
        description,
        color: DISCORD_EMBED_COLORS[result] ?? DISCORD_EMBED_COLORS.success,
        fields,
        footer: { text: "Local Cloudflare Pages Deploy" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Discord webhook failed (${response.status}): ${body}`);
    }
  } catch (error) {
    console.warn(
      `[deploy-with-discord] Failed to send Discord notification: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(
  npxCommand,
  ["wrangler", "pages", "deploy", outputDir, ...wranglerArgs],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  },
);

child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  appendOutput(chunk);
});

child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  appendOutput(chunk);
});

child.on("close", async (code, signal) => {
  const result = signal ? "cancelled" : code === 0 ? "success" : "failure";
  await sendDiscordNotification({
    output: combinedOutput.join(""),
    result,
  });

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});


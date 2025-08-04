module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "/home/nextjs/frontend",
      script: "node_modules/next/dist/bin/next",
      interpreter_args: "--max-old-space-size=4096",
      interpreter: "/usr/bin/node",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "nodeAuction",
      cwd: "/home/nextjs/frontend",
      script: "./nodeAuction.js",
      interpreter_args: "--max-old-space-size=1024",
      interpreter: "/usr/bin/node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "nodeAuctionBatch",
      cwd: "/home/nextjs/frontend",
      script: "./nodeAuctionBatch.js",
      interpreter_args: "--max-old-space-size=2048",
      interpreter: "/usr/bin/node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "nodeLive",
      cwd: "/home/nextjs/frontend",
      script: "./nodeLive.js",
      interpreter_args: "--max-old-space-size=1024",
      interpreter: "/usr/bin/node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

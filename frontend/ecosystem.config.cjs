module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "/opt/next-app/current/AuctionPackage_frontend/frontend",
      script: "node_modules/next/dist/bin/next",
      interpreter_args: "--max-old-space-size=4096",
      interpreter: "/usr/bin/node",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "nodeApp",
      cwd: "/opt/next-app/current/AuctionPackage_frontend/frontend",
      script: "./nodeApp.mjs",
      interpreter_args: "--max-old-space-size=1024",
      interpreter: "/usr/bin/node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "nodeBatch",
      cwd: "/opt/next-app/current/AuctionPackage_frontend/frontend",
      script: "./nodeBatch.mjs",
      interpreter_args: "--max-old-space-size=2048",
      interpreter: "/usr/bin/node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "nodeLive",
      cwd: "/opt/next-app/current/AuctionPackage_frontend/frontend",
      script: "./nodeLive.mjs",
      interpreter_args: "--max-old-space-size=1024",
      interpreter: "/usr/bin/node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

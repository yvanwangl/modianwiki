module.exports = {
    apps: [
        {
            name: "modianwiki",
            script: "./build/service.js",
            watch: true,
            env: {
                "PORT": 8088,
                "NODE_ENV": "development"
            },
            env_production: {
                "PROXY_HOST": "localhost",
                "PROXY_PORT": 8090,
                "PORT": 8088,
                "NODE_ENV": "production",
                "LAN_HU": "https://lanhuapp.com/web/#/item?tid=6fe1eae5-9080-4863-bb05-ec6f978189ae",
            }
        }
    ]
};
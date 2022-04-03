const fetch = require("node-fetch");

const delays = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
const url = "http://localhost:3000";
const asset_id = "0x8d12a197cb00d4747a1fe03395095ce2a5cc6819";
delays.forEach(async (delay) => {
  const res = await fetch(url + "/readings/" + asset_id, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      readings: [
        {
          timestamp: new Date(Date.now() + delay * 1000).toISOString(),
          value: Math.floor(Math.random() * 10000),
        },
      ],
      unit: "kWh",
    }),
  });
  console.log(await res.text());
});

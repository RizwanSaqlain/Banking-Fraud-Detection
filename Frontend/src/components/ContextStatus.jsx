import React from "react";

const getStatus = (ok) =>
  ok
    ? "text-green-500 border-green-500"
    : "text-red-500 border-red-500";

const ContextStatus = ({ context, userProfile }) => {
  if (!context || !userProfile) return null;

  // Checks
  const ipOk = userProfile.trustedIPs?.includes(context.ip);
  const deviceOk = userProfile.trustedDevices?.includes(context.device);
  const loginHour = new Date(context.loginTime).getHours();
  const hourOk = loginHour >= 6 && loginHour <= 22;

  let locationOk = false;
  if (
    context.location &&
    typeof context.location.latitude === "number" &&
    typeof context.location.longitude === "number" &&
    Array.isArray(userProfile.locations)
  ) {
    locationOk = userProfile.locations.some(
      (loc) =>
        typeof loc.lat === "number" &&
        typeof loc.lon === "number" &&
        Math.abs(loc.lat - context.location.latitude) < 0.5 &&
        Math.abs(loc.lon - context.location.longitude) < 0.5
    );
  }

  const typingSpeedOk =
    typeof context.typingSpeed === "number" && context.typingSpeed >= 300;
  const cursorOk =
    Array.isArray(context.cursorMovements) &&
    context.cursorMovements.length >= 10;
  const tabSwitchOk =
    typeof context.tabSwitches === "number" && context.tabSwitches <= 1;
  const fpsOk =
    typeof context.screenFPSDrops === "number" && context.screenFPSDrops <= 5;

  const items = [
    { label: "IP", ok: ipOk },
    { label: "Device", ok: deviceOk },
    { label: "Hour", ok: hourOk },
    { label: "Location", ok: locationOk },
    { label: "Typing", ok: typingSpeedOk },
    { label: "Cursor", ok: cursorOk },
    { label: "Tabs", ok: tabSwitchOk },
    { label: "FPS", ok: fpsOk },
  ];

  return (
    <div className="bg-gray-800 rounded-lg px-3 py-2 shadow mb-2 flex flex-row flex-wrap items-center space-x-2 overflow-x-auto">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col items-center border-b-2 ${getStatus(item.ok)} px-2`}
          style={{ minWidth: 48 }}
        >
          <span className="text-xs text-gray-300">{item.label}</span>
          <span className={`font-bold text-sm ${getStatus(item.ok)}`}>
            {item.ok ? "✔" : "✖"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ContextStatus;
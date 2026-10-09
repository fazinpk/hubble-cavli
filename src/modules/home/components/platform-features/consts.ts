import {
  GlobeIcon,
  RefreshCwIcon,
  ScanSearchIcon,
  WaypointsIcon,
} from "lucide-react";

export const PLATFORM_FEATURES = [
  {
    icon: GlobeIcon,
    title: "Global connectivity",
    description:
      "Integrated eSIM with worldwide LTE and LPWAN coverage. Control connectivity, data usage and costs across deployments.",
  },
  {
    icon: WaypointsIcon,
    title: "Messaging Service",
    description:
      "A secure messaging layer that routes device data to AWS, Azure, GCP or your own endpoints at scale.",
  },
  {
    icon: ScanSearchIcon,
    title: "Hubble Lens",
    description:
      "Remote access to devices in the field: run AT commands, diagnose and debug without disrupting live telemetry.",
  },
  {
    icon: RefreshCwIcon,
    title: "FOTA / DFOTA",
    description:
      "Remote firmware updates, with delta updates that cut bandwidth and keep fleets secure.",
  },
] as const;

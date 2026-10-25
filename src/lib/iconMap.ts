import type { IconType } from "react-icons";
import * as Fi from "react-icons/fi";
import * as Fa from "react-icons/fa";

const registry: Record<string, IconType> = {
  ...(Fi as unknown as Record<string, IconType>),
  ...(Fa as unknown as Record<string, IconType>),
};

export function resolveIcon(name: string | undefined, fallback: IconType = Fi.FiZap): IconType {
  if (!name) return fallback;
  return registry[name] || fallback;
}

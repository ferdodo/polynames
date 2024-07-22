import { createContext } from "preact";
import type { FrontContext } from "./types";

export const appContext = createContext<FrontContext>(null);

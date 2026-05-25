// Switch backend mode here or via UI toggle
// To switch backend globally without the UI, change DEFAULT_BACKEND in this file.

import { BackendMode, BACKEND_MODES } from "../constants";

export const DEFAULT_BACKEND: BackendMode = BACKEND_MODES.FASTAPI;